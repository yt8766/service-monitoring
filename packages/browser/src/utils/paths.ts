export const getComposedPathEle = (e: Event) => {
  if (!e) return [];
  //如果支持path属性，直接返回path属性
  //如果不支持，就通过composedPath方法获取
  const pathArr = (e as any).path || (e.composedPath && e.composedPath());

  if ((pathArr || []).length) {
    return pathArr;
  }

  //composedPath方法不兼容，手动获取
  let target = (e.target as Node) || null;
  const composedPath = [];

  while (target && target.parentNode) {
    composedPath.push(target);
    target = target.parentNode;
  }

  composedPath.push(document, window);

  return composedPath;
};

export const getComposedPath = (e: Event) => {
  if (!e) return [];
  const composedPathEle = getComposedPathEle(e);

  const composedPath = composedPathEle
    .reverse()
    .slice(2)
    .map((ele: Element) => {
      let selector = ele.tagName.toLowerCase();
      if (ele.id) {
        selector += `#${ele.id}`;
      }
      if (ele.className) {
        selector += `.${ele.className}`;
      }
      return selector;
    });

  return composedPath;
};
export const getPaths = (e: Event) => {
  if (!e) return '';
  const composedPath = getComposedPath(e);
  const selectors = composedPath.join(' > ');
  return selectors;
};
