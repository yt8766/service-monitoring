import { isElement, isMouseEvent, isTouchEvent, isValueElement } from './general';
import { lazyReportCache } from './lazyReportCache';
import { getPaths } from './paths';
import { MonitorConfig } from './report';

export const tracker = (event: Event, config: MonitorConfig) => {
  const { trackerAll = false } = config;
  if (trackerAll) return;

  const target = event.target;

  const tagName = isElement(target) ? target.tagName : undefined;
  const value = isValueElement(target) ? target.value : isElement(target) ? (target.textContent ?? '') : '';

  const x = isMouseEvent(event)
    ? event.clientX
    : isTouchEvent(event)
      ? (event.touches?.[0]?.clientX ?? event.changedTouches?.[0]?.clientX)
      : undefined;
  const y = isMouseEvent(event)
    ? event.clientY
    : isTouchEvent(event)
      ? (event.touches?.[0]?.clientY ?? event.changedTouches?.[0]?.clientY)
      : undefined;

  const data: {
    eventType: string;
    tagName?: string;
    x?: number;
    y?: number;
    path: string;
    value: string;
  } = {
    eventType: event.type,
    tagName,
    x,
    y,
    path: getPaths(event),
    value
  };

  lazyReportCache('action', data, { config });
};

const TIMEOUT = 500;
export const autoTracker = (config: MonitorConfig) => {
  const { trackerAll = false } = config;

  ['click', 'keydown', 'keyup', 'blur', 'focus', 'touchstart', 'touchend'].forEach(eventType => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    document.addEventListener(eventType, (event: Event) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        const target = event.target;
        const tagName = isElement(target) ? target.tagName : 'window';
        const dataTracker = isElement(target) ? target.getAttribute('data-tracker') : null;

        if (trackerAll || dataTracker) {
          const data = {
            eventType: event.type,
            targetName: tagName || 'window',
            x: isMouseEvent(event) ? event.clientX : undefined,
            y: isMouseEvent(event) ? event.clientY : undefined,
            path: getPaths(event),
            value: (target as HTMLInputElement).value || (target as HTMLTextAreaElement).textContent
          };

          lazyReportCache('action', data, { config });
        }
      }, TIMEOUT);
    });
  });
};
