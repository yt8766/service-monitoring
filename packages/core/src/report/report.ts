import { isFunction } from '@sentinel/shared';
import { config } from '../config/config';
import { getUniqueID } from '../getUniqueID';
import type { ReportOptions, ReportType } from '../types';

export const reportType = {
  TRACE: 'trace',
  ERROR: 'error',
  PERFORMANCE: 'performance',
  RESOURCE: 'resource',
  USER_ACTION: 'user_action',
  CONSOLE: 'console',
  NETWORK: 'network',
  REQUEST: 'request',
  RESPONSE: 'response',
  ACTION: 'action',
  BEHAVIOR: 'behavior',
  API: 'api',
  BROWSER: 'browser',
  VUE: 'vue',
  REACT: 'react'
} as const;

// ReportType 类型已集中到 types 中
const uniqueID = getUniqueID();
const reportRequest = (url: string, data: string) => {
  if (isFunction(window.fetch)) {
    window.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
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

export const report = (type: ReportType, data: Record<string, unknown>[], options: ReportOptions = {}) => {
  const { isImmediate = false } = options;
  const { dsn, appId, userId } = config;
  if (!dsn) {
    return console.error('report dsn is empty');
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
    sendBeacon(dsn, reportData);
    return;
  }

  if (isFunction(window.requestIdleCallback)) {
    window.requestIdleCallback(deadline => {
      if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
        sendBeacon(dsn, reportData);
      }
    });
  } else {
    setTimeout(() => {
      sendBeacon(dsn, reportData);
    });
  }
};
