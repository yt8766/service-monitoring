export interface Transport {
  send(data: Record<string, unknown>): void;
}
