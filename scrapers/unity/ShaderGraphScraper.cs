using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using UnityEditor;
using UnityEngine;

public class ShaderGraphScraper
{
    [Serializable]
    public class NodeData
    {
        public string id;
        public string name;
        public string[] aliases;
        public string software;
        public string context;
        public string category;
        public int inputs;
        public int outputs;
        public string color_hex;
        public int frequency_tier;
    }

    [Serializable]
    private class NodeDataCollection
    {
        public List<NodeData> nodes;
    }

    [MenuItem("Nodle/Extract Shader Graph Nodes")]
    public static void ExtractNodes()
    {
        Debug.Log("--- Starting Unity Shader Graph Node Extraction ---");

        Assembly sgAssembly = AppDomain.CurrentDomain.GetAssemblies()
            .FirstOrDefault(a => a.GetName().Name.Contains("ShaderGraph") && a.GetName().Name.Contains("Editor"));

        if (sgAssembly == null)
        {
            // Fallback: Just search all assemblies for the base class
            var allTypes = AppDomain.CurrentDomain.GetAssemblies().SelectMany(a => {
                try { return a.GetTypes(); } catch { return new Type[0]; }
            });
            var baseType = allTypes.FirstOrDefault(t => t.Name == "AbstractMaterialNode");
            if (baseType == null)
            {
                Debug.LogError("AbstractMaterialNode not found in any loaded assembly. Are you sure Shader Graph is installed?");
                return;
            }
            sgAssembly = baseType.Assembly;
        }

        var nodeTypes = sgAssembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract && t.Name.EndsWith("Node") && !t.Name.Contains("View"))
            .ToList();

        Debug.Log($"Found {nodeTypes.Count} Shader Graph Node types.");

        List<NodeData> extractedNodes = new List<NodeData>();

        foreach (Type type in nodeTypes)
        {
            string idname = type.Name;
            
            // Skip internal nodes
            if (idname.Contains("SubGraph") || idname.Contains("CustomFunction")) continue;

            // Cleanup name (e.g. MultiplyNode -> Multiply)
            string name = idname;
            if (name.EndsWith("Node")) name = name.Substring(0, name.Length - 4);
            
            int inputsCount = 2;
            int outputsCount = 1;
            
            try
            {
                // Most Shader Graph nodes inherit from ScriptableObject
                ScriptableObject nodeInstance = ScriptableObject.CreateInstance(type);
                if (nodeInstance != null)
                {
                    MethodInfo getInputSlots = type.GetMethod("GetInputSlots", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
                    MethodInfo getOutputSlots = type.GetMethod("GetOutputSlots", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
                    
                    if (getInputSlots != null)
                    {
                        var inSlots = getInputSlots.Invoke(nodeInstance, null) as System.Collections.IEnumerable;
                        if (inSlots != null) inputsCount = inSlots.Cast<object>().Count();
                    }
                    if (getOutputSlots != null)
                    {
                        var outSlots = getOutputSlots.Invoke(nodeInstance, null) as System.Collections.IEnumerable;
                        if (outSlots != null) outputsCount = outSlots.Cast<object>().Count();
                    }
                    
                    UnityEngine.Object.DestroyImmediate(nodeInstance);
                }
            }
            catch (Exception)
            {
                // Fallback to defaults if instantiation fails due to internal Unity requirements
            }

            string category = GetCategory(name);
            string colorHex = GetColorHex(category);
            int tier = GetTier(name);

            extractedNodes.Add(new NodeData
            {
                id = idname,
                name = name,
                aliases = new string[] { name.ToLower() },
                software = "Unity",
                context = "Shader Graph",
                category = category,
                inputs = inputsCount,
                outputs = outputsCount,
                color_hex = colorHex,
                frequency_tier = tier
            });
        }

        extractedNodes = extractedNodes.OrderBy(n => n.name).ToList();

        string outputPath = Path.Combine(Application.dataPath, "..", "unity_nodes.json");
        
        NodeDataCollection collection = new NodeDataCollection { nodes = extractedNodes };
        string json = JsonUtility.ToJson(collection, true);
        
        // Hack to convert {"nodes": [...]} into a pure array [...]
        int arrayStartIndex = json.IndexOf('[');
        int arrayEndIndex = json.LastIndexOf(']');
        if (arrayStartIndex != -1 && arrayEndIndex != -1)
        {
            string arrayJson = json.Substring(arrayStartIndex, arrayEndIndex - arrayStartIndex + 1);
            File.WriteAllText(outputPath, arrayJson);
            Debug.Log($"Extraction successful. {extractedNodes.Count} nodes saved to: {outputPath}");
        }
        else
        {
            Debug.LogError("Failed to format JSON array.");
        }
    }

    private static bool InheritsFrom(Type t, string baseClassName)
    {
        while (t != null)
        {
            if (t.Name == baseClassName) return true;
            t = t.BaseType;
        }
        return false;
    }

    private static string GetCategory(string name)
    {
        name = name.ToLower();
        if (name.Contains("add") || name.Contains("multiply") || name.Contains("subtract") || name.Contains("divide") || name.Contains("power") || name.Contains("math") || name.Contains("remap") || name.Contains("step") || name.Contains("clamp")) return "Math";
        if (name.Contains("color") || name.Contains("blend") || name.Contains("saturation")) return "Color";
        if (name.Contains("uv") || name.Contains("tiling") || name.Contains("offset") || name.Contains("coord") || name.Contains("panner") || name.Contains("parallax")) return "UV";
        if (name.Contains("texture") || name.Contains("sample") || name.Contains("triplanar") || name.Contains("cubemap")) return "Texture";
        if (name.Contains("input") || name.Contains("time") || name.Contains("position") || name.Contains("normal") || name.Contains("view") || name.Contains("scene")) return "Input";
        if (name.Contains("vector") || name.Contains("dot") || name.Contains("cross") || name.Contains("transform") || name.Contains("distance") || name.Contains("fresnel")) return "Vector";
        return "Utility";
    }

    private static string GetColorHex(string category)
    {
        switch (category)
        {
            case "Input": return "#3D8252";   // Green
            case "Math": return "#3E6B8C";    // Blue
            case "Color": return "#A49A32";   // Yellow
            case "UV": return "#8E465A";      // Red/Pink
            case "Texture": return "#C86432"; // Orange
            case "Vector": return "#64468C";  // Purple
            default: return "#484848";        // Grey
        }
    }

    private static int GetTier(string name)
    {
        name = name.ToLower();
        string[] common = { "add", "multiply", "texturesample", "color", "uv", "time", "position", "normal", "split", "combine", "fresnel", "lerp", "remap" };
        if (common.Any(c => name.Contains(c))) return 1;
        return 2;
    }
}
