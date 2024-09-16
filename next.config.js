/** @type {import('next').NextConfig} */

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(ttf|eotAsvg|woff|woff2)$/,
      use: {
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]",
        },
      },
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "picsum.photos",
      },
      {
        hostname: "example.com",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "instagram.frvd4-1.fna.fbcdn.net",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};
