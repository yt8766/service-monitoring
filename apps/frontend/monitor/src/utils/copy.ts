/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 */
export const copy = (text: string): Promise<void> | Error => {
  if (!text) return new TypeError('Text to copy cannot be empty');
  return navigator.clipboard.writeText(text);
};
