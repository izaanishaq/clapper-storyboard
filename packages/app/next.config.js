/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  
  // Add basePath and assetPrefix for proper routing
  assetPrefix: '',
  
  experimental: {
    serverActions: {
      // a clap file can be quite large - but that's OK
      bodySizeLimit: '32mb'
    }
  },
  images: {
    // Enable image optimization and add domain configuration
    unoptimized: true,
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  // workaround for transformers.js issues
  webpack: (config) => {
    config.resolve.alias = {
        ...config.resolve.alias,
        // "sharp$": false,
        "onnxruntime-node$": false,
    }

    // see https://github.com/replicate/replicate-javascript/issues/273#issuecomment-2248635353
    config.ignoreWarnings = [
      {
        module: /replicate/,
         message: /require function is used in a way in which dependencies cannot be statically extracted/,
      },
    ]

    return config;
},
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      },
      {
        // matching ALL routes
        source: "/:path*",
        headers: [
          // for security reasons, performance.now() is not performant unless we disable some CORS stuff
          //  more context about why, please check the Security paragraph here:
          // https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#security_requirements
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" }
        ]
      }
    ]
}
}

module.exports = nextConfig
