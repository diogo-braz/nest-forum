import swc from 'unplugin-swc'
import { configDefaults, defineConfig } from 'vitest/config'
import tsConfigPaths from 'vitest-tsconfig-paths'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, '**/data/pg/**'],
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
})
