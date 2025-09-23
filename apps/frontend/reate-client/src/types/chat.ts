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
