import { NodeData } from '@/types/node';

/**
 * Lazy loads the master nodes JSON.
 * By using dynamic import, Next.js / Webpack will chunk this 3400+ item JSON
 * into a separate file that is only fetched when this function is called,
 * keeping the initial JS bundle size small.
 */
export async function getNodes(): Promise<NodeData[]> {
  const data = await import('@/data/nodes.json');
  return data.default as NodeData[];
}
