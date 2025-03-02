/** @type {import('next').NextConfig} */
const nextConfig = {
  // 允许导入JSON文件
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    return config;
  },
};

export default nextConfig;
