import { Transport } from '@sentinel/monitor-sdk-core';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export class Metrics {
  constructor(private transport: Transport) {}

  init() {
    [onCLS, onFCP, onINP, onLCP, onTTFB].forEach(metricFn => {
      metricFn(metric => {
        // 发送性能指标到监控服务
        this.transport.send({
          event_type: 'performance',
          type: 'web-vital',
          name: metric.name,
          value: metric.value,
          path: window.location.pathname
        });
      });
    });
  }
}
