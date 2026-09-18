import type { Metadata } from 'next';
import { AuthProvider, WelcomeGate } from '@/components/auth';
import { ChatBot } from '@/components/chat';
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
            <AuthProvider>
              <HydrationStatus />
              <WelcomeGate>
                {children}
                <ChatBot />
              </WelcomeGate>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
