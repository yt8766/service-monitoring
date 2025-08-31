import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src'],
    format: ['cjs'],
    outDir: 'build/cjs',
    treeshake: true
  },
  {
    entry: ['src'],
    format: ['esm'],
    outDir: 'build/esm',
    treeshake: true
  }
]);
