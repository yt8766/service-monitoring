import { Transport } from '@sentinel/core';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export class Metrics {
  constructor(private transport: Transport) {}

  init() {
    new PerformanceObserver(list => {
      const entries = list.getEntries() as PerformanceNavigationTiming[];
      for (const entry of entries) {
        if (entry.entryType === 'navigation') {
          const fp = entry.responseEnd - entry.fetchStart;
          const ttl = entry.domInteractive - entry.fetchStart;
          const domReady = entry.domContentLoadedEventEnd - entry.fetchStart;
          const load = entry.loadEventStart - entry.fetchStart;
          const firstByte = entry.responseStart - entry.domainLookupStart;
          const dns = entry.domainLookupEnd - entry.domainLookupStart;
          const tcp = entry.connectEnd - entry.connectStart;
          const ssl = entry.secureConnectionStart ? entry.connectEnd - entry.secureConnectionStart : 0;
          const ttfb = entry.responseStart - entry.requestStart;
          const trans = entry.responseEnd - entry.responseStart;
          const dom = entry.domInteractive - entry.responseEnd;
          const res = entry.loadEventStart - entry.domContentLoadedEventEnd;

          const metrics = {
            fp,
            ttl,
            domReady,
            load,
            firstByte,
            dns,
            tcp,
            ssl,
            ttfb,
            trans,
            dom,
            res
          };

          this.transport.send({
            event_type: 'performance',
            type: 'navigation_timing',
            name: 'navigation_timing',
            value: metrics,
            path: window.location.pathname
          });
        }
      }
    }).observe({
      type: 'navigation',
      buffered: true
    });

    [onCLS, onFCP, onINP, onLCP, onTTFB].forEach(metricFn => {
      metricFn(metric => {
        // 发送性能指标到监控服务
        this.transport.send({
          event_type: 'performance',
          type: 'web_vital',
          name: metric.name,
          value: metric.value,
          path: window.location.pathname
        });
      });
    });
  }
}
