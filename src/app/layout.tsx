import type { Metadata } from 'next';
import { HydrationStatus, ThemeProvider } from '@/components/theme';
import { brandConfig } from '@/config/brand';
import './globals.css';

export const metadata: Metadata = {
  title: `${brandConfig.name} | ${brandConfig.role}`,
  description: brandConfig.description,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <HydrationStatus />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
