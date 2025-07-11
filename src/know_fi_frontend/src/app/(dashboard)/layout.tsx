import '@/styles/globals.css';

import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Link } from 'lucide-react';
import { Metadata } from 'next';

import Menu from '@/components/features/sidebarMenu';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { isDevMode } from '@/core/utils';
import ReactQueryProvider from '@/providers/lib/react-query';

export const metadata: Metadata = {
  metadataBase: new URL('https://vercel.com'),
  title: 'Next-Tailwind Starter Template',
  description: 'Starter Template',
  keywords: ['nextjs', 'tailwindcss', 'template', 'starter', 'kit'],
  openGraph: {
    siteName: 'Next-Tailwind Starter Template',
    title: 'Next-Tailwind Starter Template',
    description: 'Starter Template',
    images: '/banner.png',
    type: 'website',
  },
  twitter: {
    title: 'Next-Tailwind Starter Template',
    description: 'Starter Template',
    images: '/banner.png',
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>{isDevMode && <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />}</head>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <ReactQueryProvider>
          <TooltipProvider>
            <div className="flex h-screen w-full">
              <div className="w-[13%] md:w-[8%] lg:w-[18%] xl:w-[13%] bg-gray-300">
                <Menu />
              </div>
              <div className="w-[87%] md:w-[92%] lg:w-[82%] xl:w-[87%] mx-[5%] mt-14 overflow-auto">{children}</div>
            </div>
          </TooltipProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
