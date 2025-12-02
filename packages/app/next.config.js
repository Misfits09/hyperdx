const { configureRuntimeEnv } = require('next-runtime-env/build/configure');
const { version } = require('./package.json');

configureRuntimeEnv();

const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './src/nextra.config.tsx',
});

const basePath = process.env.NEXT_PUBLIC_HYPERDX_BASE_PATH;

module.exports = {
  basePath: basePath,
  // External packages to prevent bundling issues (moved from experimental in Next.js 15+)
  // https://github.com/open-telemetry/opentelemetry-js/issues/4297#issuecomment-2285070503
  serverExternalPackages: [
    '@opentelemetry/instrumentation',
    '@opentelemetry/sdk-node',
    '@opentelemetry/auto-instrumentations-node',
    '@hyperdx/node-opentelemetry',
    '@hyperdx/instrumentation-sentry-node',
  ],
  typescript: {
    tsconfigPath: 'tsconfig.build.json',
  },
  // Turbopack is default in Next.js 16, empty config acknowledges webpack config exists
  turbopack: {},
  // Ignore otel pkgs warnings
  // https://github.com/open-telemetry/opentelemetry-js/issues/4173#issuecomment-1822938936
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack },
  ) => {
    if (isServer) {
      config.ignoreWarnings = [{ module: /opentelemetry/ }];
    }
    return config;
  },
  ...withNextra({
    async headers() {
      return [
        {
          source: '/(.*)?', // Matches all pages
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
          ],
        },
      ];
    },
    // swcMinify is now default and the option has been removed in Next.js 13+
    // publicRuntimeConfig is deprecated - use env vars or other methods instead
    productionBrowserSourceMaps: false,
    ...(process.env.NEXT_OUTPUT_STANDALONE === 'true'
      ? {
          output: 'standalone',
        }
      : {}),
  }),
};
