import { Transport } from '@sentinel/core';
import { config, error, getLastCaptureEvent, getPaths, lazyReportCache, parseStackFrames } from '@sentinel/shared';

export class Errors {
  constructor(private transport: Transport) {}

  init() {
    error(this.transport);
    const { app, vue } = config;
    if (app) {
      app.config.errorHandler = (err: Error, vm: any, info: any) => {
        //获取执行的事件
        const lastEvent = getLastCaptureEvent();

        //获取事件的执行路径
        const paths = getPaths(lastEvent as Event);

        //上报vue错误 todo...
        const errs = parseStackFrames(err as Error);

        const { filename, functionName, lineno, colno } = errs[0] || {};

        const data = {
          errorType: 'vueError',
          filename,
          functionName,
          lineno,
          colno,
          message: err.message,
          stack: err.stack,
          paths
        };

        lazyReportCache('error', data);
      };
    } else {
      vue!.Vue.config.errorHandler = (err: Error, vm: any, info: any) => {
        //获取执行的事件
        const lastEvent = getLastCaptureEvent();

        //获取事件的执行路径
        const paths = getPaths(lastEvent as Event);

        //上报vue错误 todo...
        const errs = parseStackFrames(err as Error);

        const { filename, functionName, lineno, colno } = errs[0] || {};

        const data = {
          errorType: 'vueError',
          filename,
          functionName,
          lineno,
          colno,
          message: err.message,
          stack: err.stack,
          paths
        };

        lazyReportCache('error', data);
      };
    }
  }
}
