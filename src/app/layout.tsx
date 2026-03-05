/**
 * myAfya-AI — Root Layout
 */
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: {
    default: 'myAfya-AI — Your Health Companion',
    template: '%s | myAfya-AI',
  },
  description:
    'AI-powered personalized medicine reminder and health assistant platform. Manage medications, track adherence, and get intelligent health insights.',
  keywords: [
    'medication reminder',
    'health assistant',
    'medicine tracker',
    'pill reminder',
    'drug interactions',
    'health AI',
    'medication adherence',
  ],
  authors: [{ name: 'myAfya-AI' }],
  creator: 'myAfya-AI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'myAfya-AI — Your Health Companion',
    description: 'AI-powered personalized medicine reminder and health assistant platform.',
    siteName: 'myAfya-AI',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0ea5e9' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
