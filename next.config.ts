import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vsjbqkrvxjadnlgqcnmu.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'qhvvtlvrzaywkuztqztp.supabase.co',
      },
    ],
  },
};

export default nextConfig;
