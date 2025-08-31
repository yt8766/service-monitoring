import { getUniqueID } from '../getUniqueID';
import type { ConfigOptions } from '../types';

const uniqueID = getUniqueID();

export const config: ConfigOptions = {
  appId: uniqueID,
  userId: 'yt',
  dsn: '',
  trackerAll: false,
  app: null,
  vue: {
    Vue: null,
    router: null
  },
  ua: navigator.userAgent
};

export const setConfig = (options: ConfigOptions) => {
  for (const key in options) {
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      (config as any)[key] = options[key as keyof ConfigOptions];
    }
  }
};
