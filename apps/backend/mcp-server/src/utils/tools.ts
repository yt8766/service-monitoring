// 通过JSON描述工具
export const toolList = [
  {
    type: 'function',
    function: {
      name: 'getWeather',
      description: '获取指定城市和日期的天气信息',
      parameters: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            description: '城市名称,例如：上海、北京等'
          },
          date: {
            type: 'string',
            description: '日期，只能是："今天"、"明天"、"后天"'
          }
        },
        required: ['city', 'date']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'translate',
      description: '将指定的文本从中文翻译到英文',
      parameters: {
        type: 'object',
        properties: {
          input: {
            type: 'string',
            description: '需要翻译的文本'
          }
        },
        required: ['input']
      }
    }
  }
];
