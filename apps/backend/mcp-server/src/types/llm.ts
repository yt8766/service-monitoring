// LLM 相关严格类型定义，避免 any

export type LlmRole = 'system' | 'user' | 'assistant' | 'tool';

export interface LlmMessageBase {
  role: LlmRole;
}

export interface LlmTextMessage extends LlmMessageBase {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmToolMessage extends LlmMessageBase {
  role: 'tool';
  tool_call_id?: string;
  content: string;
}

export type LlmMessage = LlmTextMessage | LlmToolMessage | LlmAssistantWithCallsMessage;

export interface LlmFunctionCallDelta {
  index: number;
  id?: string;
  type: 'function';
  function: {
    name?: string;
    // 按 OpenAI 风格，arguments 在流式增量中是字符串分片
    arguments?: string;
  };
}

export interface LlmAssistantWithCallsMessage extends LlmMessageBase {
  role: 'assistant';
  content: string;
  tool_calls: Array<{
    index: number;
    id?: string;
    type: 'function';
    function: {
      name: string;
      arguments: string; // 完整参数 JSON 字符串
    };
  }>;
}

export interface LlmToolSchema {
  type: 'function';
  function: {
    name: string;
    description?: string;
    parameters?: unknown; // 来自外部 JSON schema，保持 unknown 避免 any
  };
}

export interface LlmRequestBody {
  model: string | undefined;
  messages: LlmMessage[] | Array<{ role: string; content: string }>;
  stream: true;
  tools?: LlmToolSchema[] | Array<Record<string, unknown>>;
}

export interface StreamChoiceDelta {
  content?: string;
  tool_calls?: LlmFunctionCallDelta[];
}

export interface StreamChoice {
  delta?: StreamChoiceDelta;
}

export interface StreamChunkPayload {
  choices?: [StreamChoice] | StreamChoice[];
}

export interface CallLlmToolCall {
  index: number;
  id?: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface CallLlmToolResult {
  content: string;
  tool_calls: CallLlmToolCall[];
}

export type CallLlmReturn = string | CallLlmToolResult;

export type StreamCallback = (chunk: string) => void;

export interface FetchWithTimeoutOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: string;
}
