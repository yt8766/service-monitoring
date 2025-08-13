type ComposedPathCapableEvent = Event & { path?: EventTarget[] };

export const getComposedPathEle = (e: Event) => {
  if (!e) return [] as EventTarget[];
  //如果支持path属性，直接返回path属性
  //如果不支持，就通过composedPath方法获取
  const withPath = e as ComposedPathCapableEvent;
  const pathArr: EventTarget[] | undefined = withPath.path || (e.composedPath && e.composedPath());

  if ((pathArr || []).length) {
    return pathArr;
  }

  //composedPath方法不兼容，手动获取
  let target = (e.target as Node) || null;
  const composedPath: EventTarget[] = [];

  while (target && target.parentNode) {
    composedPath.push(target);
    target = target.parentNode;
  }

  composedPath.push(document, window);

  return composedPath;
};

export const getComposedPath = (e: Event) => {
  if (!e) return [] as string[];
  const composedPathEle = getComposedPathEle(e);

  const composedPath = composedPathEle
    .reverse()
    .slice(2)
    .filter((et): et is Element => et instanceof Element)
    .map(ele => {
      let selector = ele.tagName.toLowerCase();
      if (ele.id) {
        selector += `#${ele.id}`;
      }
      const classAttr = ele.getAttribute('class');
      if (classAttr) {
        selector += `.${classAttr}`;
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
