import type { ReportType } from '../types';

const cacheMap = new Map<ReportType, Record<string, unknown>[]>();

export const getCache = () => cacheMap;

export const setCache = (key: ReportType, value: Record<string, unknown>) => {
  if (cacheMap.get(key)) {
    cacheMap.get(key)?.push(value);
  } else {
    cacheMap.set(key, [value]);
  }
};

export const clearCache = () => cacheMap.clear();
