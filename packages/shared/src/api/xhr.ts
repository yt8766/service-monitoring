import { lazyReportCache } from '../lazyReportCache';

const originalPrototype = XMLHttpRequest.prototype;
const originalOpen = originalPrototype.open;
const originalSend = originalPrototype.send;

// 使用 WeakMap 存储每个 XHR 实例的额外信息
const xhrInfoMap = new WeakMap<
  XMLHttpRequest,
  {
    url?: string;
    method?: string;
    startTime?: number;
    endTime?: number;
    duration?: number;
  }
>();

const overWriteOpenAndSend = () => {
  originalPrototype.open = function newOpen(method: string, url: string, ...args: unknown[]) {
    const info = xhrInfoMap.get(this) || {};
    info.url = url;
    info.method = method;
    xhrInfoMap.set(this, info);
    originalOpen.apply(this, [method, url, ...args]);
  };

  originalPrototype.send = function newSend(...args: unknown[]) {
    const info = xhrInfoMap.get(this) || {};
    info.startTime = Date.now();
    xhrInfoMap.set(this, info);

    const onLoadEnd = () => {
      const currentInfo = xhrInfoMap.get(this);
      if (currentInfo) {
        currentInfo.endTime = Date.now();
        currentInfo.duration = currentInfo.endTime - currentInfo.startTime!;

        const { status } = this;
        const { duration, startTime, endTime, url, method } = currentInfo;

        const reportData = {
          status,
          duration,
          startTime,
          endTime,
          url,
          method: method || 'GET',
          success: status >= 200 && status < 300,
          subType: 'xhr'
        };

        lazyReportCache('api', reportData);
      }

      this.removeEventListener('loadend', onLoadEnd, true);
    };

    //当请求结束时触发，无论请求成功 (load) 还是失败 (abort 或 error)
    this.addEventListener('loadend', onLoadEnd, true);
    originalSend.apply(this, args);
  };
};

export const xhr = () => {
  overWriteOpenAndSend();
};
