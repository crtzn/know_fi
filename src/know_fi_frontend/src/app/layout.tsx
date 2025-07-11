import '@/styles/globals.css';

import { Inter } from 'next/font/google';

export const metadata = {
  title: 'KnowFi',
  description: 'Hello ICP',
};
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
