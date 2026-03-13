/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: false, // Keep as false for xterm.js compatibility

  // Production optimizations
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },

  // Bundle optimization - Only keep packages you actually use
  experimental: {
    optimizePackageImports: [
      '@xterm/xterm',
      '@xterm/addon-fit',
      'lucide-react',
      'framer-motion'
    ],
    optimizeCss: true,
  },

  // Only transpile what's necessary
  transpilePackages: [
    'lucide-react'
  ],

  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    // Browser-specific configurations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }

    // Exclude xterm from server-side bundling to prevent SSR issues
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push({
        '@xterm/xterm': 'commonjs @xterm/xterm',
        '@xterm/addon-fit': 'commonjs @xterm/addon-fit',
      })
    }

    // Production optimizations
    if (!dev) {
      // Aggressive tree shaking
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
        providedExports: true,
      }

      // Optimized bundle splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          // Separate xterm into its own chunk for better caching
          xterm: {
            test: /[\\/]node_modules[\\/]@xterm[\\/]/,
            name: 'xterm',
            priority: 20,
            chunks: 'all',
          },
          // Separate framer-motion
          framer: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 15,
            chunks: 'all',
          },
        },
      }

      // Minimize bundle size
      config.optimization.minimize = true
    }

    return config
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
