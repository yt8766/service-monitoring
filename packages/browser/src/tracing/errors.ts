import { Transport } from '@sentinel/core';
import { error } from '@sentinel/shared';

export class Errors {
  constructor(private transport: Transport) {}

  init() {
    error(this.transport);
  }
}
