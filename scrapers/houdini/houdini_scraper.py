import hou
import json
import os

def get_category(name):
    name = name.lower()
    if any(x in name for x in ['add', 'multiply', 'subtract', 'divide', 'math', 'clamp', 'fit', 'blend', 'mix']): return "Math"
    if any(x in name for x in ['color', 'rgb', 'hsv']): return "Color"
    if any(x in name for x in ['uv', 'texture', 'noise']): return "Texture"
    if any(x in name for x in ['poly', 'point', 'prim', 'vertex', 'edge', 'group', 'transform']): return "Geometry"
    if any(x in name for x in ['vector', 'matrix', 'dot', 'cross', 'distance']): return "Vector"
    return "Utility"

def get_color_hex(category, is_sop):
    # Houdini standard colors: SOPs usually orange/green, VOPs usually blue/purple
    if is_sop:
        return "#D18C44" # Orange-ish for geometry
    else:
        return "#4464D1" # Blue-ish for VOPs

def get_tier(name):
    name = name.lower()
    common = ['add', 'multiply', 'transform', 'group', 'color', 'polyextrude', 'merge', 'null', 'subdivide', 'noise', 'fit']
    if any(x in name for x in common): return 1
    return 2

def extract_houdini_nodes():
    extracted_nodes = []
    
    # We will extract from SOP (Geometry) and VOP (Shading/Math)
    categories = [
        (hou.sopNodeTypeCategory(), True),
        (hou.vopNodeTypeCategory(), False)
    ]
    
    for category, is_sop in categories:
        for node_type in category.nodeTypes().values():
            # Skip hidden nodes
            if node_type.hidden():
                continue
                
            idname = node_type.name()
            name = node_type.description()
            
            # Basic pin counts
            inputs = node_type.maxNumInputs()
            if inputs > 100: inputs = 2 # Arbitrary cap for infinite inputs (like Merge node)
            outputs = 1 # Generic, since hou.NodeType doesn't provide easy output counts without instantiation
            
            cat_str = get_category(name)
            if is_sop and cat_str == "Utility":
                cat_str = "Geometry"
                
            color_hex = get_color_hex(cat_str, is_sop)
            tier = get_tier(name)
            
            extracted_nodes.append({
                "id": idname,
                "name": name,
                "aliases": [name.lower(), idname.lower()],
                "software": "Houdini",
                "context": "SOP" if is_sop else "VOP",
                "category": cat_str,
                "inputs": inputs,
                "outputs": outputs,
                "color_hex": color_hex,
                "frequency_tier": tier
            })
            
    # Sort by name
    extracted_nodes.sort(key=lambda x: x["name"])
    
    # Save to Documents folder for easy access
    output_path = os.path.join(os.path.expanduser("~"), "Documents", "houdini_nodes.json")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(extracted_nodes, f, indent=4, ensure_ascii=False)
        
    print("--------------------------------------------------")
    print(f"--- Extracted {len(extracted_nodes)} Houdini nodes ---")
    print(f"Saved to: {output_path}")
    print("--------------------------------------------------")

if __name__ == "__main__":
    extract_houdini_nodes()
