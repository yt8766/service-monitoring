import { Metrics } from '@sentinel/browser-utils';
import { Monitor, MonitorOptions } from '@sentinel/core';
import { autoTracker, tracker } from '@sentinel/shared';
import { Errors } from './tracing/errors';
import { BrowserTransport } from './transport';

const init = (options: MonitorOptions) => {
  const monitor = new Monitor(options);
  const transport = new BrowserTransport(options.dsn);
  monitor.init(transport);

  new Errors(transport).init();

  new Metrics(transport).init();

  return monitor;
};

export { autoTracker, init, tracker };
