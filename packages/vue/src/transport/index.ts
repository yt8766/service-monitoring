import { getBrowserInfo } from '@sentinel/browser-utils';
import { lazyReportCache } from '@sentinel/shared';

export class VueTransport {
  constructor(private dsn: string) {}

  send(data: Record<string, unknown>): void {
    const browserInfo = getBrowserInfo();
    const payload = {
      ...data,
      browserInfo
    };

    // Simulate sending data to the server
    // fetch(this.dsn, {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // }).catch(error => {
    //   console.error('Failed to send data:', error);
    // });

    lazyReportCache('vue', payload);
  }
}
