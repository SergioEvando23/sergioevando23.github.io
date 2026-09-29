import type { Metadata } from 'next';
import { AuthProvider, WelcomeGate } from '@/components/auth';
import { ChatBot } from '@/components/chat';
import { LanguageProvider } from '@/components/language';
import { HydrationStatus, ThemeProvider } from '@/components/theme';
import { dictionary } from '@/i18n';
import './globals.css';

export const metadata: Metadata = {
  title: dictionary.portuguese.metadata.title,
  description: dictionary.portuguese.metadata.description,
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
