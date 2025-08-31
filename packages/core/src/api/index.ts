import { isFunction } from '@sentinel/shared';
import { fetch } from './fetch';
import { xhr } from './xhr';
export const api = () => {
  if (isFunction(window.fetch)) {
    fetch();
    return;
  }
  if (isFunction(XMLHttpRequest.prototype.open)) {
    xhr();
  }
};
