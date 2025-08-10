import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src'],
    format: ['cjs'],
    outDir: 'build/cjs'
  },
  {
    entry: ['src'],
    format: ['esm'],
    outDir: 'build/esm'
  },
  {
    entry: ['src'],
    format: ['iife'],
    outDir: 'build/umd',
    name: 'SentinelMonitorSDKCore'
  }
]);
