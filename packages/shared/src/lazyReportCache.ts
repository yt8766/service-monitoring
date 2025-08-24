import { getCache, setCache } from './cache';
import { report, ReportType } from './report';

let timer: NodeJS.Timeout | null = null;
interface LazyReportOptions {
  timeout?: number;
}
export const lazyReportCache = (type: ReportType, data: Record<string, any>, options: LazyReportOptions = {}) => {
  const { timeout = 3000 } = options;
  setCache(type, data);
  clearTimeout(timer as NodeJS.Timeout);
  timer = setTimeout(() => {
    const dataMap = getCache();
    if (dataMap.size) {
      for (const [key, data] of dataMap) {
        console.log('lazyReportCache', key, data);
        report(key, data);
      }
    }
  }, timeout);
};
