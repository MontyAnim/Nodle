import unreal
import json
import os
import re

def get_node_color_hex(category):
    colors = {
        "Math": "#699B5C",
        "Constants": "#3E5D4B",
        "Coordinates": "#8D2A18",
        "Color": "#A09A3F",
        "Texture": "#246174",
        "Vectors": "#A8943D",   
        "Parameters": "#33615A",
        "Utility": "#484848",
        "Blueprint": "#4F7FC1",
        "Event": "#AA2915",
        "Function": "#355F98"
    }
    return colors.get(category, "#555555")

def get_material_category(name):
    name = name.lower()
    if "math" in name or "add" in name or "multiply" in name or "divide" in name or "subtract" in name: return "Math"
    if "constant" in name: return "Constants"
    if "coord" in name or "texcoord" in name or "panner" in name: return "Coordinates"
    if "texture" in name or "sample" in name: return "Texture"
    if "vector" in name or "rotator" in name: return "Vectors"
    if "color" in name or "desaturation" in name: return "Color"
    if "parameter" in name: return "Parameters"
    return "Utility"

def get_blueprint_category(name):
    name = name.lower()
    if "event" in name: return "Event"
    if "callfunction" in name: return "Function"
    if "math" in name: return "Math"
    return "Blueprint"

def extract_nodes():
    nodes_data = []
    
    # Obtener todas las clases disponibles en el modulo unreal
    all_unreal_classes = dir(unreal)
    
    mat_classes = [c for c in all_unreal_classes if c.startswith("MaterialExpression") and c != "MaterialExpression"]
    bp_classes = [c for c in all_unreal_classes if c.startswith("K2Node") and c != "K2Node"]
    
    print(f"--- Starting Unreal Node Extraction ---")
    
    # 1. Material Expressions
    print(f"Analyzing {len(mat_classes)} Material Expressions...")
    for cls_name in mat_classes:
        name = cls_name.replace("MaterialExpression", "")
        if not name: continue
        
        tier = 2
        common = ["Add", "Multiply", "TextureSample", "Constant", "Constant3Vector", "TextureCoordinate", "Lerp", "AppendVector", "ComponentMask", "Time", "Panner"]
        if name in common:
            tier = 1
        elif "Custom" in name or "FunctionCall" in name:
            tier = 3
            
        cat = get_material_category(name)
        
        # En Unreal API Python, obtener el conteo exacto de pines sin instanciar en un Asset es complejo.
        # Asignaremos un base estandar o intentaremos leer propiedades de la clase si existen.
        # Por seguridad y evitar crashes en la iteracion, usamos defaults inteligentes para el MVP.
        inputs_count = 2 if cat in ["Math", "Color", "Vectors"] else 1
        if cat in ["Constants", "Texture"]: inputs_count = 0
        
        nodes_data.append({
            "id": cls_name,
            "name": name,
            "aliases": [name.lower()],
            "software": "Unreal Engine",
            "context": "Material",
            "category": cat,
            "inputs": inputs_count,
            "outputs": 1, 
            "color_hex": get_node_color_hex(cat),
            "frequency_tier": tier
        })
        
    # 2. Blueprint Nodes
    print(f"Analyzing {len(bp_classes)} Blueprint Nodes...")
    for cls_name in bp_classes:
        name = cls_name.replace("K2Node_", "")
        if not name: continue
        
        tier = 2
        if "Event" in name or "CallFunction" in name or "Variable" in name or "IfThenElse" in name:
            tier = 1
            
        cat = get_blueprint_category(name)
        
        # Filtro sugerido: ignorar nodos internos/condicionales hiper específicos del engine
        if "Macro" in name or "Tunnel" in name:
            continue
            
        nodes_data.append({
            "id": cls_name,
            "name": name,
            "aliases": [name.lower()],
            "software": "Unreal Engine",
            "context": "Blueprint",
            "category": cat,
            "inputs": 2,  # Exec In + Data In
            "outputs": 2, # Exec Out + Data Out
            "color_hex": get_node_color_hex(cat),
            "frequency_tier": tier
        })
        
    # Eliminar duplicados y ordenar
    seen = set()
    unique_nodes = []
    for n in nodes_data:
        if n["id"] not in seen:
            seen.add(n["id"])
            unique_nodes.append(n)
            
    unique_nodes.sort(key=lambda x: (x["context"], x["name"]))
    
    # Save to disk
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "unreal_nodes.json")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(unique_nodes, f, indent=2, ensure_ascii=False)
        
    print(f"Extracted {len(unique_nodes)} nodes successfully.")
    print(f"Saved to: {output_path}")
    print(f"---------------------------------------")

if __name__ == "__main__":
    try:
        extract_nodes()
    except Exception as e:
        unreal.log_error(f"Error executing Nodle Unreal Scraper: {e}")
