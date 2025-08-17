import { ClickHouseClient } from '@clickhouse/client';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class StorageService {
  constructor(@Inject('CLICKHOUSE_CLIENT') private readonly clickhouseClient: ClickHouseClient) {}

  async getBugs() {
    const result = await this.clickhouseClient.query({
      query: "SELECT * FROM sentinel_monitor_view where event_type = 'error'",
      format: 'JSON'
    });
    const json = await result.json();
    return json.data;
  }

  async getData() {
    const result = await this.clickhouseClient.query({
      query: 'SELECT * FROM sentinel_monitor_view',
      format: 'JSON'
    });
    const json = await result.json();
    return json.data;
  }

  async tracing(data: any) {
    if (Array.isArray(data)) {
      for (const item of data) {
        const values = {
          app_id: item?.app_id || '5',
          event_type: item?.event_type || 'test_event',
          message: item?.message || 'This is a test message',
          info: {
            ...item
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
  }

  async tracingAppID(app_id: string, data: any) {
    if (Array.isArray(data)) {
      for (const item of data) {
        const values = {
          app_id: app_id || '5',
          event_type: item?.event_type || 'test_event',
          message: item?.message || 'This is a test message',
          info: item
        };

        await this.clickhouseClient.insert({
          table: 'sentinel_monitor',
          columns: ['app_id', 'event_type', 'message', 'info'],
          format: 'JSONEachRow',
          values
        });
      }
    }
  }

  async tracingReport(app_id: string, payload: any) {
    if (Array.isArray(payload?.data)) {
      for (const item of payload.data) {
        const values = {
          app_id: app_id || '5',
          event_type: item?.event_type || 'test_event',
          message: item?.message || 'This is a test message',
          info: payload
        };

        await this.clickhouseClient.insert({
          table: 'sentinel_monitor',
          columns: ['app_id', 'event_type', 'message', 'info'],
          format: 'JSONEachRow',
          values
        });
      }
    }
  }
}
