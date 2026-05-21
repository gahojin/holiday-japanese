import { coverageConfigDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, './scripts/**'],
    },
  },
})
