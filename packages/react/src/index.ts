import { Metrics } from '@sentinel/browser-utils';
import { api, autoTracker, ConfigOptions, Monitor, pv, setConfig, tracker } from '@sentinel/core';
import { ReactTransport } from './transport';
export { ErrorBoundary, reactErrorHandler } from './tracing/errors';
export const init = (options: ConfigOptions) => {
  const monitor = new Monitor(options);
  setConfig(options);
  const transport = new ReactTransport(options.dsn);
  monitor.init(transport);

  new Metrics(transport).init();
  autoTracker?.(); // 自动行为追踪
  pv?.(); // 页面浏览量追踪
  api?.(); // API 请求追踪

  return {
    monitor,
    tracker
  };
};
