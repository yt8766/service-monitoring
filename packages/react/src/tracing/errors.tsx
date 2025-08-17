import React from 'react';

export default class SentinelErrors extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props?: any) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ hasError: true, error });

    console.log(error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h1>错误：{`${this.state.error}`}</h1>;

      // 也可以在出错的component处展示出错信息
      // return <h1>出错了!</h1>;
    }
    return this.props.children;
  }
}
