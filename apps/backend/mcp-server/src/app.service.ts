import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { LLMService } from './llm/llm.service';
import { TranslateHandlerService } from './translate-handler/translate-handler.service';
import { CallLlmToolResult } from './types/llm';
import { toolList } from './utils/index';
import { WetherHandlerService } from './wether-handler/wether-handler.service';

@Injectable()
export class AppService {
  // 工具列表
  private readonly toolsMap;
  // 创建一个数组，用于存储对话
  private readonly conversations = [];
  constructor(
    private readonly configService: ConfigService,
    private readonly llmService: LLMService,
    private readonly WetherHandlerService: WetherHandlerService,
    private readonly translateHandlerService: TranslateHandlerService
  ) {
    this.toolsMap = {
      getWeather: this.WetherHandlerService.getWeather.bind(this.WetherHandlerService),
      translate: this.translateHandlerService.translate.bind(this.translateHandlerService)
    };
  }

  getHello(): string {
    return 'Hello World!';
  }

  async ask(req: Request, res: Response) {
    const question = req.body.question || '';
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    const messages = [...this.conversations, { role: 'user', content: question }];

    try {
      const response = (await this.llmService.callLLM(messages, toolList, chunk => {
        res.write(`${JSON.stringify({ response: chunk })}\n`);
      })) as CallLlmToolResult;

      if (response.tool_calls) {
        const toolResults = [];
        for (const toolCall of response.tool_calls) {
          try {
            // 挨着挨着去调用每一个工具
            const functionName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);

            if (this.toolsMap[functionName]) {
              const result = await this.toolsMap[functionName](args);
              toolResults.push({
                tool_call_id: toolCall.id,
                role: 'tool',
                content: result
              });
            } else {
              // 说明 toolMaps 不存在当前要调用的工具
              toolResults.push({
                tool_call_id: toolCall.id,
                role: 'tool',
                content: `未知工具${functionName}`
              });
            }
          } catch (err) {
            console.error('工具调用失败☹️', err);
            toolResults.push({
              tool_call_id: toolCall.id,
              role: 'tool',
              content: `工具调用失败☹️${err.message}`
            });
          }
        }

        // 代码来到这里，说明工具调用的环节结束了
        messages.push(
          {
            role: 'assistant',
            content: response.content,
            tool_calls: response.tool_calls
          },
          ...toolResults // 加入了工具调用的结果
        );
        const finalResponse = await this.llmService.callLLM(messages, toolList, chunk => {
          res.write(`${JSON.stringify({ response: chunk })}\n`);
        });

        this.conversations.push(
          { role: 'user', content: question }, // 原始的问题
          // 大模型判断需要调用工具的回复
          {
            role: 'assistant',
            content: response.content,
            tool_calls: response.tool_calls
          },
          // 工具调用的结果
          // 之所以要将工具调用的结果也放入到会话历史里面，是为了之后大模型能够看到之前调用工具的历史
          ...toolResults,
          { role: 'assistant', content: finalResponse }
        );
      } else {
        this.conversations.push(
          {
            role: 'user',
            content: question
          },
          {
            role: 'assistant',
            content: response
          }
        );
      }

      if (this.conversations.length > 20) {
        this.conversations.splice(0, this.conversations.length - 20); // 保持对话长度不超过20条
      }
    } catch (error) {
      console.error('LLM 调用失败:', error);
    }

    res.end();
  }

  async history() {
    return this.conversations;
  }

  async clear(req: Request, res: Response) {
    this.conversations.length = 0;
    res.json({ message: '对话记录已清空' });
  }
}
