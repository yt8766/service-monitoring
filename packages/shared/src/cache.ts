import { ReportType } from './report';

const cacheMap = new Map<ReportType, Record<string, unknown>[]>();

export const getCache = () => cacheMap;

export const setCache = (key: ReportType, value: Record<string, unknown>) => {
  if (cacheMap.get(key)) {
    cacheMap.get(key)?.push(value);
  }

  cacheMap.set(key, [value]);
};

export const clearCache = () => cacheMap.clear();
