import type { ChartResponse, Preset } from '../types';
import TITANS_500_DATA from './personalities_500.json';

export const TITANS_500_PRESETS = TITANS_500_DATA as unknown as Preset[];

let cached: Record<string, ChartResponse> | null = null;

export async function getBundledTitanChart(id: string): Promise<ChartResponse | null> {
  try {
    if (!cached) cached = (await import('./bundledTitans.json')).default as unknown as Record<string, ChartResponse>;
    return cached[id] || null;
  } catch {
    return null;
  }
}
