import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    dts({
      exclude: ['src/**/*.test.ts', 'src/**/*.bench.ts', 'src/**/*_testdata.ts'],
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    lib: {
      entry: ['src/index.ts'],
      formats: ['es'],
    },
    minify: false,
    sourcemap: true,
    rolldownOptions: {
      treeshake: true,
      output: {
        cleanDir: true,
        comments: false,
        preserveModules: true,
      },
      external: [],
      optimization: {
        inlineConst: { mode: 'all', pass: 5 },
      },
      experimental: {
        nativeMagicString: true,
      },
    },
  },
})
