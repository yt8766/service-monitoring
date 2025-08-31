import { Metrics } from '@sentinel/browser-utils';
import { api, autoTracker, ConfigOptions, Monitor, pv, setConfig, tracker } from '@sentinel/core';
import { Errors } from './tracing/errors';
import { VueTransport } from './transport';

export const init = (options: ConfigOptions) => {
  const monitor = new Monitor(options);
  setConfig(options);
  const transport = new VueTransport(options.dsn);
  monitor.init(transport);

  new Errors(transport).init();

  new Metrics(transport).init();
  autoTracker?.(); // 自动行为追踪
  pv?.(); // 页面浏览量追踪
  api?.(); // API 请求追踪

  return monitor;
};

const monitor = {
  init,
  autoTracker,
  tracker
};

export default monitor;
