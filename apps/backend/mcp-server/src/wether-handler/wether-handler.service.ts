import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WetherHandlerService {
  private readonly HEFENG_API_KEY: string;
  constructor(private readonly configService: ConfigService) {
    this.HEFENG_API_KEY = this.configService.get('HEFENG_API_KEY');
  }

  /**
   *
   * @param {*} city 城市的名称
   * @returns 城市的位置
   */
  async getCityLocation(city) {
    // 参照第三方服务商文档
    // 下面的 geoapi.qweather.com 使用的是公共 HOST
    const url = `https://mt2mtdw4j5.re.qweatherapi.com/geo/v2/city/lookup?location=${encodeURIComponent(
      city
    )}&key=${this.HEFENG_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.code === '200' && data.location?.length > 0) {
      return data.location[0].id;
    }

    return null;
  }

  /**
   * 格式化天气
   * @param {*} text "今天"、"明天"...
   * @requires YYYY-MM-DD
   */
  formatDate(text) {
    const today = new Date();

    if (text.includes('今天')) return today.toISOString().split('T')[0]; // 2025-07-16
    if (text.includes('明天')) {
      const tomorrow = new Date(today.getTime() + 86400000);
      return tomorrow.toISOString().split('T')[0];
    }
    if (text.includes('后天')) {
      const dayAfter = new Date(today.getTime() + 2 * 86400000);
      return dayAfter.toISOString().split('T')[0];
    }

    // 英文日期格式（兼容性支持）
    if (text.toLowerCase().includes('today')) return today.toISOString().split('T')[0];
    if (text.toLowerCase().includes('tomorrow')) {
      const tomorrow = new Date(today.getTime() + 86400000);
      return tomorrow.toISOString().split('T')[0];
    }

    // 直接传入 yyyy-mm-dd 则不处理
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

    return null; // 暂不识别
  }

  /**
   *
   * @param {*} city 城市
   * @param {*} date 日期
   */
  async getWeather({ city, date }) {
    // 参考第三方服务商文档
    const formattedDate = this.formatDate(date);
    if (!formattedDate) {
      console.error('无法识别日期格式:', date);
      return `无法识别日期格式："${date}"，请使用"今天"、"明天"或"后天"`;
    }

    const locationId = await this.getCityLocation(city);
    if (!locationId) {
      console.error('无法识别城市:', city);
      return `无法识别城市："${city}"`;
    }

    try {
      const url = `https://mt2mtdw4j5.re.qweatherapi.com/v7/weather/7d?location=${locationId}&key=${this.HEFENG_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json(); // 拿到的是一周的天气
      if (data.code !== '200') {
        console.error('天气API返回错误:', data.code);
        return '获取天气数据失败';
      }

      const match = data.daily.find(d => d.fxDate === formattedDate); // 过滤出需要的那一天的天气数据
      if (!match) {
        console.error('没有找到对应日期的天气数据:', formattedDate);
        return `暂无 ${formattedDate} 的天气数据`;
      }

      const result = `📍 ${city}（${formattedDate}）天气：${match.textDay}，气温 ${match.tempMin}°C ~ ${match.tempMax}°C`;
      console.log('天气查询成功:', result);

      return result;
    } catch (error) {
      console.error('天气查询异常:', error);
      return '天气查询服务暂时不可用';
    }
  }
}
