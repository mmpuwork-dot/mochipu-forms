import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mochipu Forms',
  description: 'Client form system for Mochipu Live2D',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
