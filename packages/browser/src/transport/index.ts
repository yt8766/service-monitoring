import { getBrowserInfo } from '@sentinel/browser-utils';
import { Transport } from '@sentinel/core';

export class BrowserTransport implements Transport {
  constructor(private dsn: string) {}

  send(data: Record<string, unknown>): void {
    const browserInfo = getBrowserInfo();
    const payload = {
      ...data,
      browserInfo
    };

    fetch(this.dsn, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(error => {
      console.error('上报数据失败:', error);
    });
  }
}
