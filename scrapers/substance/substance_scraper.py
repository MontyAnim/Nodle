import sd
import json
import os

def get_category(name, group_name):
    name = name.lower()
    group_name = group_name.lower() if group_name else ""
    
    if 'math' in group_name or any(x in name for x in ['add', 'multiply', 'subtract', 'divide', 'blend', 'logic']): return "Math"
    if 'color' in group_name or any(x in name for x in ['hsl', 'rgb', 'grayscale', 'gradient', 'curve']): return "Color"
    if 'pattern' in group_name or 'noise' in group_name or 'generator' in group_name: return "Texture"
    if 'filter' in group_name or 'transform' in group_name or 'blur' in group_name or 'warp' in group_name: return "UV"
    return "Utility"

def get_color_hex(category):
    # Substance Designer often uses a dark UI, with orange highlights
    return "#E27B3B" if category in ["Texture", "Color"] else "#7B7B7B"

def get_tier(name):
    name = name.lower()
    common = ['blend', 'blur', 'transform 2d', 'uniform color', 'levels', 'gradient map', 'histogram', 'grayscale conversion', 'warp', 'directional warp']
    if any(x in name for x in common): return 1
    return 2

def extract_substance_nodes():
    ctx = sd.getContext()
    app = ctx.getSDApplication()
    
    # In Substance Designer, Node Definitions are stored inside Modules.
    module_mgr = app.getModuleMgr()
    node_defs = []
    
    for m in module_mgr.getModules():
        if hasattr(m, "getDefinitions"):
            try:
                defs = m.getDefinitions()
                if defs:
                    for d in defs:
                        # Duck-typing: If it has properties, it's a node definition we can scrape
                        if hasattr(d, "getProperties"):
                            node_defs.append(d)
            except Exception:
                pass
        elif hasattr(m, "getNodeDefinitions"):
            try:
                defs = m.getNodeDefinitions()
                if defs: node_defs.extend(defs)
            except Exception:
                pass

    if not node_defs:
        print("ERROR: Could not find node definitions even after fallback.")
        return
    
    extracted_nodes = []
    
    for n in node_defs:
        idname = n.getId()
        
        # Safe get label (some definitions might not have it, fallback to id)
        name = idname
        if hasattr(n, "getLabel") and n.getLabel():
            name = n.getLabel()
        
        # Skip pure input/output router nodes or base internal definitions
        if idname.startswith("sbs::compositing::input") or idname.startswith("sbs::compositing::output"):
            continue
            
        group = idname # We use the ID as a hint for the group since getCategory doesn't exist
        
        inputs = 0
        outputs = 0
        
        try:
            # Query input properties
            props = n.getProperties(sd.api.sdproperty.SDPropertyCategory.Input)
            if props: inputs = len(props)
            
            # Query output properties
            out_props = n.getProperties(sd.api.sdproperty.SDPropertyCategory.Output)
            if out_props: outputs = len(out_props)
        except Exception:
            pass # Failsafe
        
        cat_str = get_category(name, group)
        color_hex = get_color_hex(cat_str)
        tier = get_tier(name)
        
        extracted_nodes.append({
            "id": idname,
            "name": name,
            "aliases": [name.lower(), idname.split("::")[-1].lower()],
            "software": "Substance",
            "context": "Graph",
            "category": cat_str,
            "inputs": inputs,
            "outputs": outputs,
            "color_hex": color_hex,
            "frequency_tier": tier
        })
        
    extracted_nodes.sort(key=lambda x: x["name"])
    
    output_path = os.path.join(os.path.expanduser("~"), "Documents", "substance_nodes.json")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(extracted_nodes, f, indent=4, ensure_ascii=False)
        
    print("--------------------------------------------------")
    print(f"--- Extracted {len(extracted_nodes)} Substance Designer nodes ---")
    print(f"Saved to: {output_path}")
    print("--------------------------------------------------")

if __name__ == "__main__":
    extract_substance_nodes()
