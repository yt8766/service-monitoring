import { getUniqueID } from './getUniqueID';

const uniqueID = getUniqueID();

export interface ConfigOptions {
  appId?: string;
  userId?: string;
  dsn: string;
  trackerAll?: boolean;
  app?: any;
  react?: any;
  vue?: {
    Vue?: any;
    router?: any;
  };
  ua?: string;
}

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
