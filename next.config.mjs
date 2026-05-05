/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_EXPORT === '1';
const deployBasePath = process.env.NEXT_BASE_PATH || '';

const nextConfig = {
  ...(isExport && { output: 'export' }),
  // Only apply basePath/assetPrefix for static exports — not dev or regular builds,
  // because basePath would shift API routes and break the local mock API.
  ...(isExport && deployBasePath && {
    basePath: deployBasePath,
    assetPrefix: deployBasePath,
  }),
};

export default nextConfig;
