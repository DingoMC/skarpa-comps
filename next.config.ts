import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /**
   * This webpack mod allows access to `process.env` dynamically
   * Static approach: `process.env.NEXT_PUBLIC_VAR`
   * Dynamic approach: `process.env['NEXT_PUBLIC_VAR']`
   */
  webpack: (config, { webpack, isServer }) => {
    const envs: { [key: string]: string | undefined } = {};
    Object.keys(process.env).forEach((env) => {
      if (env.startsWith('NEXT_PUBLIC_')) {
        envs[env] = process.env[env];
      }
    });

    if (!isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env': JSON.stringify(envs),
        })
      );
    }

    return config;
  },
  devIndicators: false,
};

export default nextConfig;
