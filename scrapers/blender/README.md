# Nodle - Blender Node Scraper

Este script utiliza la API de Python de Blender (`bpy`) para extraer automáticamente todos los metadatos de los nodos disponibles en **ShaderNodeTree** (Materiales) y **GeometryNodeTree** (Geometry Nodes).

## Prerrequisitos

Necesitas tener **Blender** instalado en tu sistema (versión recomendada: 3.0 o superior). El script se ejecuta utilizando el intérprete de Python interno que viene empaquetado con Blender.

## Cómo Ejecutar

Abre tu terminal y ejecuta el siguiente comando, apuntando al ejecutable de Blender de tu sistema:

```bash
# En Windows (ejemplo de ruta típica)
"C:\Program Files\Blender Foundation\Blender 4.0\blender.exe" --background --python blender_scraper.py

# En macOS
/Applications/Blender.app/Contents/MacOS/Blender --background --python blender_scraper.py

# En Linux
blender --background --python blender_scraper.py
```

- `--background` (o `-b`): Ejecuta Blender sin interfaz gráfica de usuario.
- `--python` (o `-P`): Ejecuta el script indicado usando el contexto interno de `bpy`.

## Resultado

El script generará (o sobrescribirá) un archivo llamado `blender_nodes.json` en este mismo directorio. Este archivo contendrá una lista estructurada de nodos listos para ser consumidos por el pipeline de Nodle.
