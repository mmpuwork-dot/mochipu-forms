import type { Metadata } from 'next';
import './globals.css';

// Cloudflare Pages (via @cloudflare/next-on-pages) requires every non-static
// route to run on the Edge runtime. Setting it on the root layout propagates
// to all child segments. API routes still need their own `runtime = 'edge'`.
export const runtime = 'edge';

export const metadata: Metadata = {
  title: 'Mochipu Forms',
  description: 'Client form system for Mochipu Live2D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
