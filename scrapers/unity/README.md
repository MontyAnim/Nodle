# Nodle - Unity Shader Graph Scraper

Este script C# está diseñado para ser ejecutado directamente en el entorno de desarrollo de Unity.

## Prerrequisitos

1. **Unity Editor** instalado (versión 2021+ recomendada).
2. Un proyecto activo que utilice **Universal Render Pipeline (URP)** o **High Definition Render Pipeline (HDRP)** con el paquete de **Shader Graph** instalado.

## Instrucciones de Ejecución

1. Copia el archivo `ShaderGraphScraper.cs` de esta misma carpeta.
2. Abre tu proyecto de Unity.
3. En la ventana **Project** (el explorador de archivos de Unity), navega hasta la carpeta `Assets`.
4. Crea una carpeta llamada `Editor` si no existe (la ruta exacta debe ser `Assets/Editor`).
5. Pega el archivo `ShaderGraphScraper.cs` dentro de la carpeta `Editor`. Unity compilará el script de inmediato.
6. En la barra de menú superior de Unity, aparecerá una nueva opción. Ve a **Nodle > Extract Shader Graph Nodes**.
7. Al hacer clic, revisa la consola de Unity. Debería indicar que la extracción fue exitosa.

## Resultado

El script extraerá y generará un archivo llamado `unity_nodes.json` en la carpeta raíz de tu proyecto de Unity (al mismo nivel que la carpeta `Assets`, justo fuera de ella). 

Mueve o copia ese JSON de vuelta a la estructura de este repositorio para ser consumido en los siguientes pasos (NDL-08).
