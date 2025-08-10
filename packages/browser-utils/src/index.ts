export function getBrowserInfo() {
  return {
    useAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    referer: document.referrer,
    path: location.pathname
  };
}

export { Metrics } from './integrations/metrics';
