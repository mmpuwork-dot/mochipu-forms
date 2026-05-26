import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // required for Cloudflare Pages
  },
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium'],
};

export default withNextIntl(nextConfig);
