# Nodle - Unreal Engine Node Scraper

Este script utiliza la API de Python de Unreal Engine (`unreal`) para extraer los metadatos de los nodos de Materiales (`MaterialExpression`) y Blueprints (`K2Node`).

## Prerrequisitos

1. Tener **Unreal Engine** instalado y un proyecto abierto.
2. Habilitar el plugin de Python en tu proyecto:
   - Ve a `Edit > Plugins`.
   - Busca **"Python Editor Script Plugin"** y actívalo.
   - Reinicia el editor si es necesario.

## Cómo Ejecutar

Debido a que el script requiere el módulo `unreal` de C++ precompilado y vinculado a la sesión del motor, **no puedes ejecutar este script desde una terminal de sistema convencional**. Debes correrlo dentro del Editor.

### Método 1: Output Log
1. En Unreal Engine, ve a `Window > Output Log`.
2. En la parte inferior de la ventana, cambia la línea de comandos de `Cmd` a `Python`.
3. Ejecuta el archivo pasándole la ruta absoluta:
   ```python
   exec(open("C:/ruta/a/tu/repo/Nodle/scrapers/unreal/unreal_scraper.py").read())
   ```

### Método 2: Menú de Scripts
Alternativamente, puedes añadir la carpeta `scrapers/unreal` a las rutas de Python de tu proyecto (Project Settings > Python) y ejecutarlo desde el menú File.

## Resultado

El script extraerá y generará (o sobrescribirá) un archivo llamado `unreal_nodes.json` en este mismo directorio. Esta lista procesada será digerida posteriormente por el pipeline central de Nodle.
