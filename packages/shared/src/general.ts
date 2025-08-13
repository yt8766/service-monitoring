export const isFunction = (value: unknown): value is (...args: unknown[]) => boolean => {
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
