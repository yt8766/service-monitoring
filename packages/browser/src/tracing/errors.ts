import { Transport } from '@sentinel/monitor-sdk-core';
import { getLastCaptureEvent, getPaths } from '../utils';

export class Errors {
  //限制追溯的错误堆栈数量
  private readonly STACK_TRACE_LIMIT = 10;
  private readonly FULL_MATCH =
    /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
  constructor(private transport: Transport) {}

  init() {
    window.addEventListener('error', event => {
      const target: any = event.target;
      console.log('error 监听中...');

      //获取执行的事件
      const lastEvent = getLastCaptureEvent();
      const paths = getPaths(lastEvent as Event);

      if ((target && target.src) || target.href) {
        console.log('捕获到资源加载错误:', target.src || target.href);

        this.transport.send({
          event_type: 'resourceError',
          filename: target.src || target.href,
          tagName: target.tagName,
          message: `加载${target.tagName}失败}`
        });
      } else {
        const errs = this.parseStackFrames(event.error as Error);
        const { filename, functionName, lineno, colno } = errs[0] || {};

        this.transport.send({
          event_type: 'jsError',
          filename,
          functionName,
          lineno,
          colno,
          stack: event.error.stack,
          message: event.message,
          path: paths
        });
      }
    });

    window.addEventListener('unhandledrejection', event => {
      console.log('捕获到未处理的 Promise 拒绝:', event.reason);
      const reason = event.reason;
      const lastEvent = getLastCaptureEvent();
      const paths = getPaths(lastEvent as Event);

      const errs = this.parseStackFrames(event.reason as Error);
      const { filename, functionName, lineno, colno } = errs[0] || {};
      //发送未处理的 Promise 拒绝错误
      this.transport.send({
        event_type: 'promiseError',
        filename,
        functionName,
        lineno,
        colno,
        message: reason.message,
        stack: reason.stack,
        path: paths
      });
    });
  }

  //解析错误堆栈
  parseStackFrames(error: Error) {
    const { stack } = error;
    //如果没有stack直接返回[]
    if (!stack) return [];
    const frames = [];

    for (const line of stack.split('\n').slice(1)) {
      const frame = this.parseStackLine(line); //分析一行的错误信息
      if (frame.filename) {
        //放入到堆栈错误信息数组中
        frames.push(frame);
      }
    }
    return frames.slice(0, this.STACK_TRACE_LIMIT);
  }

  parseStackLine(line: string) {
    const lineMatch = line.match(this.FULL_MATCH);
    if (!lineMatch) return {};
    const filename = lineMatch[2] || '<anonymous>';
    const functionName = lineMatch[1] || '';
    const lineno = lineMatch[3] ? parseInt(lineMatch[3], 10) : undefined;
    const colno = lineMatch[4] ? parseInt(lineMatch[4], 10) : undefined;

    return {
      filename,
      functionName,
      lineno,
      colno
    };
  }
}
