import { getCache, setCache } from './cache';
import { report, ReportOptions, ReportType } from './report';

let timer: NodeJS.Timeout | null = null;
interface LazyReportOptions extends ReportOptions {
  timeout?: number;
}
export const lazyReportCache = (type: ReportType, data: Record<string, unknown>, options: LazyReportOptions) => {
  const { timeout = 3000 } = options;
  setCache(type, data);
  clearTimeout(timer as NodeJS.Timeout);
  timer = setTimeout(() => {
    const dataMap = getCache();
    if (dataMap.size) {
      for (const [key, data] of dataMap) {
        console.log('lazyReportCache', key, data);
        report(key, data, options);
      }
    }
  }, timeout);
};
