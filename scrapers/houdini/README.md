# Houdini Node Scraper

Este script extrae la lista de nodos (SOP y VOP) disponibles en tu instalación de **SideFX Houdini** y genera un archivo JSON estandarizado para la base de datos de Nodle.

## Instrucciones de Uso

1. Abre **Houdini**.
2. Abre la ventana **Python Shell** (puedes encontrarla en el menú superior: `Windows > Python Shell`).
3. Abre el archivo `houdini_scraper.py` en cualquier editor de texto y **copia** todo su contenido.
4. **Pega** el código en el Python Shell de Houdini y presiona `Enter`.
5. El script se ejecutará, analizará las categorías `SOP` (Geometry) y `VOP` (Shading/Math), y guardará un archivo `houdini_nodes.json` directamente en tu carpeta de **Documentos** (`C:\Users\TuUsuario\Documents\houdini_nodes.json`).

El archivo generado contendrá un listado completo de los nodos (excluyendo nodos internos ocultos), con sus respectivas categorías, y pines de entrada/salida (máximo permitido).
