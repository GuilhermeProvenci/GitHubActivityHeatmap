import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    dom: 'src/dom/index.ts',
    react: 'src/react.tsx',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  clean: true,
  outExtension({ format }) {
    return { js: format === 'esm' ? '.mjs' : '.cjs' };
  },
  external: ['react'],
});
