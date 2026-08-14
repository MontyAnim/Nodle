import { NodeData } from "@/types/node";

/**
 * Retorna el índice de día UTC actual (Días desde el 1 de Enero de 1970).
 */
export function getUTCDayIndex(): number {
  return Math.floor(Date.now() / 86400000);
}

/**
 * Generador Pseudo-Aleatorio determinista (Mulberry32).
 * Toma una semilla (estado) y retorna una función que al llamarse
 * genera un número entre 0 y 1.
 */
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Obtiene el nodo correspondiente al reto del día.
 * Se asegura de filtrar solo nodos del tier 1 y de ordenarlos
 * consistentemente antes de elegir uno basado en el PRNG sembrado.
 */
export function getDailyTargetNode(
  nodes: NodeData[],
  dayIndex: number
): NodeData {
  // 1. Filtrar solo los nodos más universales/comunes
  const validNodes = nodes.filter((n) => n.frequency_tier === 1);

  if (validNodes.length === 0) {
    throw new Error("No hay nodos válidos en el catálogo (Tier 1).");
  }

  // 2. Ordenamiento estricto por ID para garantizar la misma posición
  // sin importar en qué navegador o versión de Node corra.
  validNodes.sort((a, b) => a.id.localeCompare(b.id));

  // 3. Inicializar el PRNG con el día actual como semilla.
  // Sumamos un offset numérico arbitrario para ofuscar ligeramente el patrón.
  const prng = mulberry32(dayIndex + 19937);

  // 4. Extraer el índice
  const index = Math.floor(prng() * validNodes.length);

  return validNodes[index];
}


/**
 * Softwares disponibles como filtros en el Modo Practica.
 */
export const AVAILABLE_SOFTWARE = [
  'Blender',
  'Unreal Engine',
  'Unity',
  'Houdini',
  'Substance Designer',
] as const;

export type AvailableSoftware = typeof AVAILABLE_SOFTWARE[number];

/**
 * Filtros disponibles para el Modo Practica.
 */
export interface PracticeFilter {
  software: AvailableSoftware | null;
  tier: 1 | 2 | 3 | null;
}

/**
 * Retorna un nodo aleatorio para el Modo Practica.
 * No es determinista — usa Math.random() en cada llamada.
 * No modifica estadisticas historicas ni envia datos al Leaderboard.
 */
export function getRandomNode(
  nodes: NodeData[],
  filter: PracticeFilter
): NodeData | null {
  let pool = [...nodes];

  if (filter.software !== null) {
    pool = pool.filter((n) => n.software === filter.software);
  }

  if (filter.tier !== null) {
    pool = pool.filter((n) => n.frequency_tier === filter.tier);
  }

  if (pool.length === 0) return null;

  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
