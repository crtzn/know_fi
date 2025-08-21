import '@/styles/globals.css';

import { Inter, Pixelify_Sans } from 'next/font/google';

import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'KnowFi',
  description: 'Hello ICP',
};
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-pixelify-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${pixelifySans.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
