import os
import json
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9_]+', '_', text)
    return text.strip('_')

def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    scrapers_dir = os.path.join(repo_root, "scrapers")
    
    data_dir = os.path.join(repo_root, "src", "data")
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        
    master_nodes = []
    
    # Required keys to validate against
    required_keys = ['id', 'name', 'aliases', 'software', 'context', 'category', 'inputs', 'outputs', 'color_hex', 'frequency_tier']
    
    for root, dirs, files in os.walk(scrapers_dir):
        for file in files:
            if file.endswith("_nodes.json"):
                file_path = os.path.join(root, file)
                
                with open(file_path, "r", encoding="utf-8") as f:
                    try:
                        nodes = json.load(f)
                    except json.JSONDecodeError:
                        print(f"Error decoding {file_path}")
                        continue
                        
                software_name = "Unknown"
                if nodes and isinstance(nodes, list):
                    for node in nodes:
                        # Validate required keys
                        for k in required_keys:
                            if k not in node:
                                print(f"Warning: Missing key '{k}' in node {node.get('name', 'Unknown')}")
                                
                        software = node.get("software", "Unknown")
                        if software == "Substance":
                            software = "Substance Designer"
                            node["software"] = software
                            
                        original_id = node.get("id", "unknown_id")
                        
                        # Generate unique ID to prevent collisions across software
                        # e.g. "blender_shadernodemath"
                        unique_id = f"{slugify(software)}_{slugify(original_id)}"
                        node["id"] = unique_id
                        
                        master_nodes.append(node)
                    
                    print(f"Processed {len(nodes)} nodes from {file}")

    # Output path
    output_path = os.path.join(data_dir, "nodes.json")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(master_nodes, f, indent=2, ensure_ascii=False)
        
    print("--------------------------------------------------")
    print(f"Total Nodes Consolidated: {len(master_nodes)}")
    print(f"Master JSON saved to: {output_path}")
    print("--------------------------------------------------")

if __name__ == "__main__":
    main()
