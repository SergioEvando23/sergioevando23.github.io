import type { Metadata } from 'next';
import { LanguageProvider } from '@/components/language';
import { HydrationStatus, ThemeProvider } from '@/components/theme';
import { dicionario } from '@/i18n/dicionario';
import './globals.css';

export const metadata: Metadata = {
  title: dicionario.portugues.metadata.title,
  description: dicionario.portugues.metadata.description,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <HydrationStatus />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
