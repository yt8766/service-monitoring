export class TracingStorageDto {
  app_id: string;
  event_type: string;
  message: string;
  info: TracingStorageDto & {
    filename: string;
    functionName: string;
    lineno: string;
    colno: string;
    stack: string;
    useAgent: string;
    platform: string;
    language: string;
    referer: string;
    path: string;
  };
}
