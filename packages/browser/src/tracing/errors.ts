import { Transport, error } from '@sentinel/core';

export class Errors {
  constructor(private transport: Transport) {}

  init() {
    error(this.transport);
  }
}
