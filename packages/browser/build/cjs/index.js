var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  return to;
};
var __toCommonJS = mod => __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  init: () => init
});
module.exports = __toCommonJS(index_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 &&
  (module.exports = {
    init
  });
