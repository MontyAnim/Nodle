import bpy
import json
import os
import re

def get_node_color_hex(category):
    # Mapping based on common Blender node header colors
    colors = {
        "Input": "#E35622",      # Orange
        "Output": "#E35622",
        "Color": "#C4A62D",      # Yellow
        "Vector": "#665C9D",     # Purple
        "Converter": "#4D76A5",  # Light Blue
        "Math": "#4D76A5",
        "Shader": "#468B5E",     # Green
        "Texture": "#B55A25",    # Brown/Orange
        "Geometry": "#00D6A3",   # Cyan
        "Attribute": "#4D76A5",
        "Layout": "#444444"      # Dark Grey
    }
    return colors.get(category, "#888888")

def get_node_category(idname, name):
    idname = idname.lower()
    name = name.lower()
    if "math" in idname or "math" in name: return "Math"
    if "color" in idname or "mix" in idname: return "Color"
    if "vector" in idname or "mapping" in idname: return "Vector"
    if "tex" in idname: return "Texture"
    if "bsdf" in idname or "shader" in idname or "emission" in idname: return "Shader"
    if "output" in idname: return "Output"
    if "input" in idname or "info" in idname or "coordinate" in idname: return "Input"
    if "geom" in idname or "mesh" in idname or "curve" in idname or "points" in idname: return "Geometry"
    if "attribute" in idname: return "Attribute"
    return "Converter"

def extract_nodes(context_name):
    if context_name == "Shader":
        mat = bpy.data.materials.new(name="TempExtractMat")
        tree = mat.node_tree if hasattr(mat, "node_tree") else None
        if not tree:
            mat.use_nodes = True
            tree = mat.node_tree
        types_to_check = [name for name in dir(bpy.types) if name.startswith("ShaderNode") or name.startswith("FunctionNode")]
    else:
        # Geometry nodes
        group = bpy.data.node_groups.new(name="TempExtractGeo", type="GeometryNodeTree")
        tree = group
        types_to_check = [name for name in dir(bpy.types) if name.startswith("GeometryNode") or name.startswith("FunctionNode")]

    nodes_data = []

    print(f"[{context_name}] Found {len(types_to_check)} candidate types to check.")
    for class_name in types_to_check:
        idname = class_name
        
        # Skip some internal or custom group nodes
        if "Custom" in idname or "Group" in idname or idname == "NodeGroup":
            continue

        try:
            node = tree.nodes.new(type=idname)
        except Exception as e:
            print(f"Error instantiating {idname}: {e}")
            continue
        
        name = node.bl_label if node.bl_label else node.name
        name = re.sub(r'\.\d+$', '', name) # Remove numeric suffixes like "Math.001"
        
        # Count visible inputs and outputs
        inputs = [i for i in node.inputs if not i.hide]
        outputs = [o for o in node.outputs if not o.hide]
        
        category = get_node_category(idname, name)
        color_hex = get_node_color_hex(category)
        
        # Basic heuristic frequency tier (1 = common, 3 = rare)
        tier = 2
        common_nodes = ["ShaderNodeBsdfPrincipled", "ShaderNodeTexImage", "ShaderNodeMath", "ShaderNodeMix", "ShaderNodeMapping", "ShaderNodeTexCoord", "GeometryNodeObjectInfo", "GeometryNodeTransform"]
        if idname in common_nodes:
            tier = 1
            
        nodes_data.append({
            "id": idname,
            "name": name,
            "aliases": [name.lower().replace(" ", "")],
            "software": "Blender",
            "context": context_name,
            "category": category,
            "inputs": len(inputs),
            "outputs": len(outputs),
            "color_hex": color_hex,
            "frequency_tier": tier
        })
        
        tree.nodes.remove(node)

    if context_name == "Shader":
        bpy.data.materials.remove(mat)
    else:
        bpy.data.node_groups.remove(group)
        
    return nodes_data

def main():
    print("\n--- Starting Blender Node Extraction for Nodle ---")
    shader_nodes = extract_nodes("Shader")
    geo_nodes = extract_nodes("Geometry")
    
    all_nodes = shader_nodes + geo_nodes
    
    seen = set()
    unique_nodes = []
    for n in all_nodes:
        if n["id"] not in seen:
            seen.add(n["id"])
            unique_nodes.append(n)
            
    unique_nodes.sort(key=lambda x: (x["context"], x["name"]))

    # Guardar el JSON en el mismo directorio que este script
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "blender_nodes.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(unique_nodes, f, indent=2, ensure_ascii=False)
        
    print(f"Extraction successful: {len(unique_nodes)} nodes extracted.")
    print(f"Saved to: {output_path}")
    print("------------------------------------------------\n")

if __name__ == "__main__":
    main()
