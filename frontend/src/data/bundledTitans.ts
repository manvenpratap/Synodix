import type { ChartResponse } from '../types';

let cachedTitans: Record<string, ChartResponse> | null = null;

export async function getBundledTitanChart(id: string): Promise<ChartResponse | null> {
  try {
    if (!cachedTitans) {
      const module = await import('./bundledTitans.json');
      cachedTitans = module.default as unknown as Record<string, ChartResponse>;
    }
    return cachedTitans[id] || null;
  } catch (err) {
    console.warn('Failed to load bundled titan chart:', err);
    return null;
  }
}
