import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false })
