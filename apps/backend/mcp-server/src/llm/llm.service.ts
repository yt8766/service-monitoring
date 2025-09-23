import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CallLlmReturn,
  CallLlmToolCall,
  FetchWithTimeoutOptions,
  LlmRequestBody,
  StreamCallback,
  StreamChunkPayload
} from '../types/llm';

const promptStr = [
  '你是一个中文智能助手，请严格使用中文来回答用户的问题。',
  '你是一个专业的编程助手，擅长回答关于编程和技术相关的问题。',
  '你是一个工作很久的前端架构师，擅长回答关于前端架构和技术相关的问题。'
];

@Injectable()
export class LLMService {
  private readonly LLM_ENDPOINT: string;
  private readonly LLM_MODEL: string;
  private readonly DEEPSEEK_API_KEY: string;
  private readonly LLM_TIMEOUT_MS: number;
  constructor(private readonly configService: ConfigService) {
    this.LLM_ENDPOINT = this.configService.get('LLM_ENDPOINT');
    this.LLM_MODEL = this.configService.get('LLM_MODEL');
    this.DEEPSEEK_API_KEY = this.configService.get('DEEPSEEK_API_KEY');
    this.LLM_TIMEOUT_MS = this.configService.get('LLM_TIMEOUT_MS');
  }

  async fetchWithTimeout(
    url: string,
    options: FetchWithTimeoutOptions = {},
    timeout: number = this.LLM_TIMEOUT_MS || 30000
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutID = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutID);
      return response;
    } catch (error) {
      clearTimeout(timeoutID);
      if ((error as Error & { name?: string }).name === 'AbortError') {
        throw new Error('请求超时');
      }
      throw error;
    }
  }

  async callLLM(
    messages: LlmRequestBody['messages'],
    tools: LlmRequestBody['tools'] | null = null,
    callback?: StreamCallback
  ): Promise<CallLlmReturn> {
    const requestBody: LlmRequestBody = {
      model: this.LLM_MODEL,
      messages: messages.map(message => {
        if (message.role === 'user') {
          return {
            role: 'user',
            content: `${promptStr.join('\n')}\n\n${message.content}`
          };
        }
        return message;
      }),
      stream: true
    };

    if (tools) requestBody.tools = tools;

    const response = await this.fetchWithTimeout(this.LLM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      throw new Error(`LLM 请求失败: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('LLM 返回空的响应体');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let fullResponse = '';
    const tollCalls: CallLlmToolCall[] = []; // 用于存储函数调用结果

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim());

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') continue;

        try {
          const data = JSON.parse(jsonStr) as unknown as StreamChunkPayload;
          const delta = data.choices?.[0]?.delta;
          // const chunk = data.choices?.[0]?.delta?.content || "";
          // if (chunk) {
          //   fullResponse += chunk;
          //   callback?.(chunk);
          // }
          if (delta) {
            if (delta.content) {
              fullResponse += delta.content;
              callback?.(delta.content);
            }

            if (delta.tool_calls) {
              for (const tollCall of delta.tool_calls) {
                const existingCall = tollCalls.find(call => call.index === tollCall.index);
                if (existingCall) {
                  if (tollCall.function?.name) {
                    existingCall.function.name = tollCall.function.name;
                  }
                  if (tollCall.function?.arguments) {
                    existingCall.function.arguments += tollCall.function.arguments;
                  }
                } else {
                  tollCalls.push({
                    index: tollCall.index,
                    id: tollCall.id,
                    type: 'function',
                    function: {
                      name: tollCall.function?.name ?? '',
                      arguments: tollCall.function?.arguments ?? ''
                    }
                  });
                }
              }
            }
          }
        } catch (e) {
          console.log('JSON 解析错误:', (e as Error).message);
        }
      }
    }

    if (tollCalls.length > 0) {
      return {
        content: fullResponse,
        tool_calls: tollCalls
      };
    }

    return fullResponse;
  }
}
