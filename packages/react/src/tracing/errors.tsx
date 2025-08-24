import { getLastCaptureEvent, getPaths, isFunction, parseStackFrames } from '@sentinel/shared';
import React, { JSX } from 'react';

type ErrorBoundaryFallback =
  | React.ReactNode
  | ((error: Error) => React.ReactNode)
  | JSX.Element
  | ((error: Error) => JSX.Element);

interface ErrorBoundaryProps {
  fallback?: ErrorBoundaryFallback;
  children: React.ReactNode | JSX.Element;
}

export const reactErrorHandler = (
  error: unknown,
  errorInfo?:
    | React.ErrorInfo
    | {
        componentStack?: string | undefined;
      }
    | {
        componentStack?: string | undefined;
        errorBoundary?: React.Component<unknown> | undefined;
      }
) => {
  const lastEvent = getLastCaptureEvent();

  //获取事件的执行路径
  const paths = getPaths(lastEvent as Event);

  //上报vue错误 todo...
  const errs = parseStackFrames(error as Error);

  const { filename, functionName, lineno, colno } = errs[0] || {};

  const errorData = {
    errorType: 'reactError',
    desc: error?.toString(),
    stack: errorInfo?.componentStack,
    filename,
    functionName,
    lineno,
    colno,
    path: paths
  };

  console.log('reactErrorHandler', errorData);
};

export class ErrorBoundary extends React.Component<
  { fallback?: ErrorBoundaryFallback; children: React.ReactNode | JSX.Element },
  { hasError: boolean; error: Error | null; fallback: ErrorBoundaryFallback }
> {
  constructor(props: ErrorBoundaryProps) {
    const { fallback } = props;
    super(props);
    this.state = {
      hasError: false,
      error: null,
      fallback: fallback
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ hasError: true, error });
    reactErrorHandler(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      let fallback: React.ReactNode;

      if (isFunction(this.state.fallback) && this.state.fallback) {
        fallback = (this.state.fallback(this.state.error) as React.ReactNode) || <h1>出错了!</h1>;
      } else {
        fallback = (this.state.fallback as React.ReactNode) || <h1>出错了!</h1>;
      }
      // 可以在这里记录错误信息
      return fallback;

      // 也可以在出错的component处展示出错信息
      // return <h1>出错了!</h1>;
    }
    return this.props.children;
  }
}
