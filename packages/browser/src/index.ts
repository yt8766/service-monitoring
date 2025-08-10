import { Metrics } from '@sentinel/monitor-sdk-browser-utils';
import { Monitor, MonitorOptions } from '@sentinel/monitor-sdk-core';
import { Errors } from './tracing/errors';
import { BrowserTransport } from './transport';
export const init = (options: MonitorOptions) => {
  const monitor = new Monitor(options);
  const transport = new BrowserTransport(options.dsn);
  monitor.init(transport);

  new Errors(transport).init();

  new Metrics(transport).init();

  return monitor;
};
