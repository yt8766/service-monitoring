import { Transport } from '../transport';

export interface IIntegration {
  init(transport: Transport): void;
}

export class Integration implements IIntegration {
  transport: Transport | null = null;

  init(transport: Transport): void {
    this.transport = transport;
  }
}

export interface MonitorOptions {
  dsn: string; // 监控地址
  integrations?: IIntegration[]; // 集成的插件
}
