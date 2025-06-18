import tsconfigPaths from 'vite-tsconfig-paths'
import { coverageConfigDefaults, defineConfig, type UserConfigExport } from 'vitest/config'

const config: UserConfigExport = {
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, './scripts/**'],
    },
  },
}

export default defineConfig(config)
