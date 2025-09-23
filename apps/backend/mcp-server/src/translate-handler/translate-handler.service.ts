import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class TranslateHandlerService {
  private readonly ID: string;
  private readonly KEY: string;
  constructor(private readonly configService: ConfigService) {
    this.ID = this.configService.get('BAIDU_APP_ID');
    this.KEY = this.configService.get('BAIDU_SECRET_KEY');
  }

  async translate({ input }) {
    // 参照第三方服务提供文档
    // 学习阶段，仅支持中文翻译成英文
    // 参照第三方服务提供文档
    // 学习阶段，仅支持中文翻译成英文
    const text = input.replace(/.*翻译.*?[：:]?\s*/, '').trim();
    const salt = Date.now();
    const sign = crypto
      .createHash('md5')
      .update(this.ID + text + salt + this.KEY)
      .digest('hex');

    const url = `https://fanyi-api.baidu.com/api/trans/vip/translate?q=${encodeURIComponent(
      text
    )}&from=zh&to=en&appid=${this.ID}&salt=${salt}&sign=${sign}`;

    const res = await fetch(url);
    const data = await res.json();
    if (data.trans_result?.length > 0) {
      return `翻译结果：${data.trans_result[0].dst}`;
    } else {
      return `翻译失败：${JSON.stringify(data)}`;
    }
  }
}
