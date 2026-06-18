import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    silent: false,
    globals: true,
    environment: 'node',
    setupFiles: ['./src/configuration/tests/vitest.units.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    retry: 0,
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/*.integration.test.ts', '**/*.repository.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
