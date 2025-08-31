import type { Transport } from './transport';
import type { MonitorOptions } from './types';

export let getTransport: () => Transport | null = () => null;

export class Monitor {
  private transport: Transport | null = null;

  constructor(private options: MonitorOptions) {}

  init(transport: Transport): void {
    this.transport = transport;
    getTransport = () => this.transport;
    // 如果有integrations，就应该消费integrations
    for (const integration of this.options.integrations || []) {
      integration.init(transport);
    }
  }
}
