module.exports = {
  basePath: '',
  output: 'export',
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
  productionBrowserSourceMaps: true,
  transpilePackages: ['@ionic/react', '@ionic/core', '@stencil/core', 'ionicons'],
};
