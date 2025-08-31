export const isFunction = (value: unknown): value is (...args: unknown[]) => unknown => {
  return typeof value === 'function';
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null;
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number';
};

export const isArray = Array.isArray;

export const isElement = (t: EventTarget | null): t is Element => t instanceof Element;
export const isValueElement = (
  t: EventTarget | null
): t is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement =>
  t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement;
export const isMouseEvent = (e: Event): e is MouseEvent => e instanceof MouseEvent;
export const isTouchEvent = (e: Event): e is TouchEvent =>
  (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) || 'touches' in e || 'changedTouches' in e;

export const log = (...args: unknown[]) => console.log(...args);
export const error = (...args: unknown[]) => console.error(...args);
export const warn = (...args: unknown[]) => console.warn(...args);
export const info = (...args: unknown[]) => console.info(...args);
export const debug = (...args: unknown[]) => console.debug(...args);

export const table = (...args: unknown[]) => console.table(...args);

export const round = Math.round;
