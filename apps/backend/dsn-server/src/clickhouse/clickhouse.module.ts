import { createClient } from '@clickhouse/client';
import { DynamicModule, Global, Module } from '@nestjs/common';

type ClickhouseOptions = {
  username: string;
  password: string;
  url: string;
};

@Global()
@Module({})
export class ClickhouseModule {
  static forRoot(options: ClickhouseOptions): DynamicModule {
    return {
      module: ClickhouseModule,
      providers: [
        {
          provide: 'CLICKHOUSE_CLIENT',
          useFactory: () => {
            return createClient(options);
          }
        }
      ],
      exports: ['CLICKHOUSE_CLIENT']
    };
  }
}
