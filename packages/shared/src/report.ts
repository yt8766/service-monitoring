import { isFunction } from './general';
import { getUniqueID } from './getUniqueID';

interface MonitorConfig {
  appId: string;
  userId: string;
  url: string;
  headers?: Record<string, string>;
  method?: 'POST' | 'GET';
}

export interface ReportOptions {
  config: MonitorConfig;
  isImmediate?: boolean;
}
export const reportType = {
  TRACE: 'trace',
  ERROR: 'error',
  PERFORMANCE: 'performance',
  RESOURCE: 'resource',
  USER_ACTION: 'user_action',
  CONSOLE: 'console',
  NETWORK: 'network',
  REQUEST: 'request',
  RESPONSE: 'response'
} as const;

export type ReportType = (typeof reportType)[keyof typeof reportType];

const uniqueID = getUniqueID();

const reportRequest = (url: string, data: string) => {
  if (isFunction(window.fetch)) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    })
      .then((response: Response) => {
        if (!response.ok) {
          console.error('Error sending data:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error sending data:', error);
      });
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // Successfully sent data
        console.log('Successfully sent data');
      } else {
        // Error sending data
        console.error('Error sending data');
      }
    };
  }
};

const sendBeacon = (url: string, data: string) => {
  if (isFunction(navigator.sendBeacon)) {
    navigator.sendBeacon(url, data);
  } else {
    reportRequest(url, data);
  }
};

export const report = (type: ReportType, data: Record<string, unknown>[], options: ReportOptions) => {
  const { config, isImmediate = false } = options;
  const { url, appId, userId } = config;
  if (!url) {
    return console.error('report url is empty');
  }

  const reportData = JSON.stringify({
    id: uniqueID,
    currentTime: Date.now(),
    currentPage: window.location.href,
    appId,
    userId,
    type,
    data
  });

  if (isImmediate) {
    sendBeacon(url, reportData);
    return;
  }

  if (isFunction(window.requestIdleCallback)) {
    window.requestIdleCallback(deadline => {
      if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
        sendBeacon(url, reportData);
      }
    });
  } else {
    setTimeout(() => {
      sendBeacon(url, reportData);
    });
  }
};
