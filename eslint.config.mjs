// Root ESLint config - delegates to individual package configs
// This file exists primarily for lint-staged which runs from the workspace root
export default [
  {
    ignores: [
      'node_modules/**',
      '**/node_modules/**',
      '**/build/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.cjs',
    ],
  },
];

