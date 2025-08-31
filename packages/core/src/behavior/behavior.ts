import { log } from '@sentinel/shared';
import { lazyReportCache } from '../lazyReportCache/lazyReportCache';
import { report } from '../report/report';
import type { NavigatorWithConnection } from '../types';
const connection = (navigator as NavigatorWithConnection).connection;

const getNetworkType = (key: string) => {
  if (connection) {
    return connection[key as keyof typeof connection] || '';
  }
  return '';
};

/**
 * 页面浏览量
 */
export const pv = () => {
  lazyReportCache('behavior', {
    event_type: 'behavior',
    subType: 'pv',
    type: 'pv',
    referrer: document.referrer || '',
    effectiveType: getNetworkType('effectiveType'), // 网络连接类型
    rtt: connection ? connection.rtt : 0 // 往返时间
  });
};

/**
 * 页面停留时间
 */
export const pageStayTime = () => {
  const startTime = performance.now();
  window.addEventListener(
    'beforeunload',
    () => {
      const stayTime = performance.now() - startTime;

      report(
        'behavior',
        [
          {
            event_type: 'behavior',
            type: 'beforeunload',
            subType: 'pageStayTime',
            effectiveType: getNetworkType('effectiveType'), // 网络连接类型
            stayTime
          }
        ],
        { isImmediate: true }
      );
    },
    true
  );
};

export const pageChange = () => {
  let form = document.referrer;

  window.addEventListener(
    'popstate',
    () => {
      const to = window.location.href;
      log(`Page changed from ${form} to ${to}`);
      lazyReportCache('behavior', {
        event_type: 'behavior',
        type: 'popstate',
        subType: 'pageChange',
        from: form,
        to
      });
      form = to;
    },
    true
  );
};

export const hashChange = () => {
  let oldURL = document.location.href;
  window.addEventListener(
    'hashchange',
    event => {
      const newURL = event.newURL;

      lazyReportCache('behavior', {
        event_type: 'behavior',
        type: 'hashChange',
        subType: 'pageChange',
        from: oldURL,
        to: newURL
      });

      oldURL = newURL;
    },
    true
  );
};
