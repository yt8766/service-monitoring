import { ClickHouseClient } from '@clickhouse/client';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  constructor(@Inject('CLICKHOUSE_CLIENT') private readonly clickhouseClient: ClickHouseClient) {}

  async getData() {
    const result = await this.clickhouseClient.query({
      query: 'SELECT * FROM sentinel_monitor_view',
      format: 'JSON'
    });
    const json = await result.json();
    return json.data;
  }

  async tracing(data: any) {
    const values = {
      app_id: data?.app_id || '5',
      event_type: data?.event_type || 'test_event',
      message: data?.message || 'This is a test message',
      info: data || {
        key: 'value'
      }
    };

    await this.clickhouseClient.insert({
      table: 'sentinel_monitor',
      columns: ['app_id', 'event_type', 'message', 'info'],
      format: 'JSONEachRow',
      values
    });
  }
}
