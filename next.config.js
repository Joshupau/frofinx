module.exports = {
  basePath: '',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**',
      },
    ],
    unoptimized: true,
  },
  // Removed `output: 'export'` to avoid static-export-only restrictions during dev
  // If you need static export later, re-enable and ensure all dynamic routes
  // are covered by `generateStaticParams()`.
  swcMinify: true,
  productionBrowserSourceMaps: true,
  transpilePackages: ['@ionic/react', '@ionic/core', '@stencil/core', 'ionicons'],
};
