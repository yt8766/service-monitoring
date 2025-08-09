(() => {
  // src/index.ts
  var Monitor = class {
    constructor(options) {
      this.dsn = options.dsn;
      this.integrations = options.integrations || [];
    }
    init(transport) {
      transport.send({});
    }
  };
  var BrowserTransport = class {
    constructor(dsn) {
      this.dsn = dsn;
    }
    send(data) {
      console.log('\u6D4F\u89C8\u5668\u4E0A\u62A5', data);
    }
  };
  var init = options => {
    const monitor = new Monitor(options);
    const transport = new BrowserTransport(options.dsn);
    monitor.init(transport);
  };
})();
