'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { ThemeSwitcher } from '@/components/theme';
import { Container } from '@/components/ui/Container';
import { IconButton } from '@/components/ui/IconButton';
import { brandConfig } from '@/config/brand';
import { navigationItems } from '@/config/navigation';
import { cn } from '@/lib/cn';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    mobilePanelRef.current?.querySelector<HTMLElement>('a, button')?.focus();

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-overlay backdrop-blur-xl">
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-4">
        <Link
          aria-label={`${brandConfig.name}, início`}
          className="text-xl font-black tracking-normal text-text"
          href="#inicio"
        >
          {brandConfig.initials}.
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-6 lg:flex">
          {navigationItems.map((item) => (
            <Link
              className="text-sm font-semibold text-text-muted transition-colors hover:text-text"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <IconButton
            label="Abrir GitHub"
            onClick={() => window.open(brandConfig.socialLinks.github, '_blank', 'noreferrer')}
            size="small"
            variant="ghost"
          >
            <GitHubIcon aria-hidden="true" fontSize="inherit" />
          </IconButton>
          <IconButton
            label="Abrir LinkedIn"
            onClick={() => window.open(brandConfig.socialLinks.linkedin, '_blank', 'noreferrer')}
            size="small"
            variant="ghost"
          >
            <LinkedInIcon aria-hidden="true" fontSize="inherit" />
          </IconButton>
          <ThemeSwitcher />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeSwitcher />
          <IconButton
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMobileOpen((current) => !current)}
            ref={menuButtonRef}
            variant="default"
          >
            {mobileOpen ? (
              <CloseIcon aria-hidden="true" fontSize="inherit" />
            ) : (
              <MenuIcon aria-hidden="true" fontSize="inherit" />
            )}
          </IconButton>
        </div>
      </Container>

      <div
        className={cn(
          'border-t border-border bg-overlay backdrop-blur-xl md:hidden',
          mobileOpen ? 'block' : 'hidden',
        )}
        id="mobile-navigation"
        ref={mobilePanelRef}
      >
        <Container className="flex flex-col gap-3 py-4">
          {navigationItems.map((item) => (
            <Link
              className="rounded-[var(--radius-md)] px-3 py-3 text-base font-semibold text-text-muted transition-colors hover:bg-surface-secondary hover:text-text"
              href={item.href}
              key={item.href}
              onClick={closeMobileMenu}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-2 border-t border-border pt-3">
            <IconButton
              label="Abrir GitHub"
              onClick={() => window.open(brandConfig.socialLinks.github, '_blank', 'noreferrer')}
              variant="ghost"
            >
              <GitHubIcon aria-hidden="true" fontSize="inherit" />
            </IconButton>
            <IconButton
              label="Abrir LinkedIn"
              onClick={() =>
                window.open(brandConfig.socialLinks.linkedin, '_blank', 'noreferrer')
              }
              variant="ghost"
            >
              <LinkedInIcon aria-hidden="true" fontSize="inherit" />
            </IconButton>
          </div>
        </Container>
      </div>
    </header>
  );
}
