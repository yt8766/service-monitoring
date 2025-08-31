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

// Report 相关
export interface ReportOptions {
  isImmediate?: boolean;
}

export type ReportType =
  | 'trace'
  | 'error'
  | 'performance'
  | 'resource'
  | 'user_action'
  | 'console'
  | 'network'
  | 'request'
  | 'response'
  | 'action'
  | 'behavior'
  | 'api'
  | 'browser'
  | 'vue'
  | 'react';

// lazyReportCache 相关
export interface LazyReportOptions {
  timeout?: number;
}

// Navigator 扩展
export interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType?: string;
    rtt?: number;
  };
}

// 事件路径计算相关
export type ComposedPathCapableEvent = Event & { path?: EventTarget[] };

// Config 相关
export interface ConfigOptions {
  appId?: string;
  userId?: string;
  dsn: string;
  trackerAll?: boolean;
  app?: any;
  react?: any;
  vue?: {
    Vue?: any;
    router?: any;
  };
  ua?: string;
}
