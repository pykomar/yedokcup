import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Vercel keeps full type checking; local sandboxed builds run `tsc` separately
  // because Next's checker spawns a child process, which this environment blocks.
  typescript: { ignoreBuildErrors: process.env.NEXT_SKIP_TYPE_CHECK === '1' },
  // Sandboxed environments can block child-process spawns. Running the build
  // workers as threads keeps `next build` viable without a shell escape.
  experimental: { cpus: 1, workerThreads: true },
  async headers() {
    return [
      {
        source: '/board',
        headers: [{ key: 'X-Frame-Options', value: 'ALLOWALL' }],
      },
    ];
  },
};

export default nextConfig;
