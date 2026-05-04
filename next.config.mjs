/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_EXPORT === '1';

const nextConfig = {
  ...(isExport && { output: 'export' }),
};

export default nextConfig;
