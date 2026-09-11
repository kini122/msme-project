import type { Metadata } from 'next';
import { Inter, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/layout/app-shell';
import { AppDataProvider } from '@/lib/store/app-data-context';
import { AuthProvider } from '@/lib/auth/auth-context';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MSME & Government Scheme Intelligence | CA Rangamani Associates',
  description: 'Enterprise MSME Udyam Analytics & Real-Time Government Scheme Matching Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${hanken.variable} ${jetbrains.variable}`}>
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <AuthProvider>
          <AppDataProvider>
            <AppShell>{children}</AppShell>
          </AppDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
