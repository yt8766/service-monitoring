import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src'],
    format: ['cjs'],
    outDir: 'build/cjs',
    external: ['react']
  },
  {
    entry: ['src'],
    format: ['esm'],
    outDir: 'build/esm',
    external: ['react']
  },
  {
    entry: ['src'],
    format: ['iife'],
    outDir: 'build/umd',
    name: 'SentinelReact',
    external: ['react']
  }
]);
