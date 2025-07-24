import '@/styles/globals.css';

import { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ProtectedRoute } from '@/components/features/ProtectedRoute';
import Sidebar from '@/components/features/sidebar/sidebar';
import Menu from '@/components/features/sidebarMenu';
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
            <ProtectedRoute>
              <div className="flex h-screen w-full">
                <div className="w-[4%]">
                  {/* <Menu /> */}
                  <Sidebar />
                </div>
                <div className="w-full overflow-auto px-[12%] pt-14">{children}</div>
              </div>
            </ProtectedRoute>
          </TooltipProvider>
        </ReactQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
