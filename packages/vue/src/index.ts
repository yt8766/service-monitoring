import { Monitor } from '@sentinel/core';
import { autoTracker, ConfigOptions, setConfig, tracker } from '@sentinel/shared';
import { Errors } from './tracing/errors';
import { VueTransport } from './transport';
export { getUniqueID, pageChange, pageStayTime, tracker } from '@sentinel/shared';
export const init = (options: ConfigOptions) => {
  const monitor = new Monitor(options);
  setConfig(options);
  const transport = new VueTransport(options.dsn);
  monitor.init(transport);

  new Errors(transport).init();

  // new Metrics(transport).init();
  // autoTracker?.(); // 自动行为追踪
  // pv?.(); // 页面浏览量追踪
  // api?.(); // API 请求追踪

  return monitor;
};

const monitor = {
  init,
  autoTracker,
  tracker
};

export default monitor;
