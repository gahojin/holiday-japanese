import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'

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
      platform: 'neutral',
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
