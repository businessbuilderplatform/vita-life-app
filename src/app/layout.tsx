import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vita-Life | AI-Powered Health & Wellness Platform',
  description: 'A superior AI-driven health and wellness web application for all ages. Track your health metrics, get personalized recommendations, and achieve your wellness goals.',
  keywords: 'health, wellness, AI, fitness, medical, tracking, personalized health',
  authors: [{ name: 'Vita-Life Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Vita-Life | AI-Powered Health & Wellness Platform',
    description: 'Transform your health journey with AI-powered insights and personalized wellness recommendations.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vita-Life | AI-Powered Health & Wellness Platform',
    description: 'Transform your health journey with AI-powered insights and personalized wellness recommendations.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <QueryProvider>
              <div className="min-h-screen bg-background">
                {children}
              </div>
              <Toaster />
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}