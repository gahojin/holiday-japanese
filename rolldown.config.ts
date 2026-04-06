import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'

export default defineConfig([
  {
    external: [],
    treeshake: true,
    optimization: {
      inlineConst: true,
    },
    experimental: {
      nativeMagicString: true,
    },
    input: 'src/index.ts',
    output: [{ dir: 'dist', format: 'es', sourcemap: true, cleanDir: true }],
    plugins: [dts()],
  },
])
