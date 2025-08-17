import { lazyReportCache } from '../lazyReportCache';

const originalFetch = window.fetch;

interface FetchReportData {
  subType: string;
  method: string;
  startTime: number;
  url: RequestInfo | URL;
  endTime?: number;
  duration?: number;
  status?: number;
  success?: boolean;
}

const overWriteFetch = () => {
  window.fetch = function newFetch(url, config) {
    const startTime = Date.now();

    const reportData: FetchReportData = {
      subType: 'fetch',
      method: config?.method || 'GET',
      startTime,
      url
    };

    return originalFetch(url, config)
      .then(response => {
        reportData.endTime = Date.now();
        reportData.duration = reportData.endTime - reportData.startTime;
        reportData.status = response.status;
        reportData.success = response.ok;

        // Report the fetch data
        lazyReportCache('api', reportData);

        return response;
      })
      .catch(error => {
        reportData.endTime = Date.now();
        reportData.duration = reportData.endTime - reportData.startTime;
        reportData.success = false;
        reportData.status = 0;

        lazyReportCache('api', reportData);
        return error;
      });
  };
};

export const fetch = () => {
  overWriteFetch();
};
