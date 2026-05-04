/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_EXPORT === '1';
const deployBasePath = process.env.NEXT_BASE_PATH || '';

const nextConfig = {
  ...(isExport && { output: 'export' }),
  ...(deployBasePath && {
    basePath: deployBasePath,
    assetPrefix: deployBasePath,
  }),
};

export default nextConfig;
