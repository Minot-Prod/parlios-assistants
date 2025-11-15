/** @type {import("next").NextConfig} */
const nextConfig = {
  output: undefined,
  experimental: { serverActions: { bodySizeLimit: "2mb" } }
};
export default nextConfig;
