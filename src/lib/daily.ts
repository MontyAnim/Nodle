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

export interface DailyModeConfig {
  id: string;
  seedOffset: number;
  filter: (node: NodeData) => boolean;
}

export const MODES_CONFIG: Record<string, DailyModeConfig> = {
  classic: {
    id: 'classic',
    seedOffset: 19937,
    filter: () => true, // El modo clásico usa todo el catálogo
  },
  tier1: {
    id: 'tier1',
    seedOffset: 10001,
    filter: (n) => n.frequency_tier === 1,
  },
  tier2: {
    id: 'tier2',
    seedOffset: 20002,
    filter: (n) => n.frequency_tier === 2,
  },
  tier3: {
    id: 'tier3',
    seedOffset: 30003,
    filter: (n) => n.frequency_tier === 3,
  },
  blender: {
    id: 'blender',
    seedOffset: 40004,
    filter: (n) => n.software === 'Blender',
  },
  houdini: {
    id: 'houdini',
    seedOffset: 50005,
    filter: (n) => n.software === 'Houdini',
  },
  substance: {
    id: 'substance',
    seedOffset: 60006,
    filter: (n) => n.software === 'Substance',
  },
  unity: {
    id: 'unity',
    seedOffset: 70007,
    filter: (n) => n.software === 'Unity',
  },
  unreal: {
    id: 'unreal',
    seedOffset: 80008,
    filter: (n) => n.software === 'Unreal Engine',
  }
};

/**
 * Obtiene el nodo correspondiente al reto del día basado en el modo.
 */
export function getDailyTargetNode(
  nodes: NodeData[],
  dayIndex: number,
  modeConfig: DailyModeConfig = MODES_CONFIG.classic
): NodeData {
  // 1. Filtrar los nodos según el modo
  const validNodes = nodes.filter(modeConfig.filter);

  if (validNodes.length === 0) {
    throw new Error(`No hay nodos válidos en el catálogo para el modo ${modeConfig.id}.`);
  }

  // 2. Ordenamiento estricto por ID para garantizar la misma posición
  // sin importar en qué navegador o versión de Node corra.
  validNodes.sort((a, b) => a.id.localeCompare(b.id));

  // 3. Inicializar el PRNG con el día actual como semilla.
  // Sumamos un offset numérico arbitrario por modo.
  const prng = mulberry32(dayIndex + modeConfig.seedOffset);

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
