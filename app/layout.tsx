import { Jua } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const jua = Jua({ weight: '400', subsets: ['latin'], variable: '--font-jua' });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko" className={jua.variable}>
      <body className="bg-linear-to-b from-sky-light to-sky-dark min-h-screen text-ink">
        {children}
      </body>
    </html>
  );
}
