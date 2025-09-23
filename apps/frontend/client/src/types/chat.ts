// 会话与服务端事件相关类型

export type ChatRole = 'user' | 'bot';

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export type HistoryRole = 'user' | 'assistant';

export interface HistoryMessage {
  role: HistoryRole;
  content: string;
}

export interface ServerEventPayload {
  response?: string;
}

export interface HistoryListResponse {
  conversations: HistoryMessage[];
}

// 为了在 ESLint/TS 环境不依赖 DOM lib，定义最小可用的流式类型
export interface StreamReaderChunk {
  done: boolean;
  value?: Uint8Array;
}

export interface StreamReader {
  read: () => Promise<StreamReaderChunk>;
}

export interface ReadableStreamLike {
  getReader: () => StreamReader;
}

export interface StreamingResponse {
  ok: boolean;
  json: <T = unknown>() => Promise<T>;
  body?: ReadableStreamLike;
}

export interface ScrollToOptionsLike {
  top?: number;
  left?: number;
  behavior?: 'auto' | 'smooth';
}

export interface ScrollableElement {
  scrollTo: (options: ScrollToOptionsLike) => void;
  scrollHeight: number;
}

// 浏览器全局 API 轻量声明，避免在无 DOM lib 的 eslint 环境报错
// 注意：这不会影响运行时，由宿主环境提供实现
declare global {
  function alert(message?: string): void;
  function confirm(message?: string): boolean;
}

export {};
