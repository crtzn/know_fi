import '@/styles/globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { HeaderDemo } from '@/components/features/header/header';
import { ProtectedRoute } from '@/components/features/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { isDevMode } from '@/core/utils';
import ReactQueryProvider from '@/providers/lib/react-query';

export const metadata: Metadata = {
  metadataBase: new URL('https://vercel.com'),
  title: 'Knowfi',
  description: 'template',
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

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>{isDevMode && <script src="https://unpkg.com/react-scan/dist/auto.global.js" async />}</head>
      <body className={`${inter.className}`}>
        <ReactQueryProvider>
          <TooltipProvider>
            {/* <ProtectedRoute> */}
            <div className="relative h-screen w-full">
              {/* keep header fixed at top */}
              <div className="fixed left-0 top-0 z-50 w-full">
                <HeaderDemo />
              </div>

              {/* scrollable content area: offset for header height (70px used here) */}
              <div className="hide-scrollbar w-full overflow-auto pt-[58px]">{children}</div>
            </div>
            {/* </ProtectedRoute> */}
          </TooltipProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
