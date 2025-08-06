interface InitOptions {
  dsn: string;
  integrations?: any[];
}

type Transport = BrowserTransport;

class Monitor {
  dsn: string;
  integrations: any[];
  constructor(options: InitOptions) {
    this.dsn = options.dsn;
    this.integrations = options.integrations || [];
  }

  init(transport: Transport) {
    transport.send({});
  }
}

class BrowserTransport {
  constructor(private dsn: string) {}
  send(data: Record<string, any>) {
    console.log('浏览器上报', data);
  }
}

export const init = (options: InitOptions) => {
  const monitor = new Monitor(options);
  const transport = new BrowserTransport(options.dsn);
  monitor.init(transport);
};
