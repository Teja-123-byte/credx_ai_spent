import type { ReactNode } from 'react';
import type { Metadata } from 'next'
 
export const metadata: Metadata = {
  title: 'SpendLens - AI Spend Audit and Optimization',
  description: '...',
}
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen font-[Inter,sans-serif] antialiased">
        {children}
      </body>
    </html>
  );
}
