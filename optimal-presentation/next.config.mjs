/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs' module on the client to prevent this error on build
      config.resolve.fallback = {
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        os: false,
        https: false,
        http: false,
        url: false,
        assert: false,
        buffer: false,
        process: false,
      }
    }

    // Handle node: protocol imports for pptxgenjs
    config.externals = config.externals || []
    if (!isServer) {
      config.externals.push({
        'node:fs': 'commonjs node:fs',
        'node:https': 'commonjs node:https',
        'node:http': 'commonjs node:http',
        'node:url': 'commonjs node:url',
        'node:path': 'commonjs node:path',
        'node:stream': 'commonjs node:stream',
        'node:crypto': 'commonjs node:crypto',
        'node:os': 'commonjs node:os'
      })
    }

    return config
  },
}

export default nextConfig
