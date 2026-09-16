'use client';

import Link from 'next/link';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useLanguage } from '@/components/language';
import { Container } from '@/components/ui/Container';
import { IconButton } from '@/components/ui/IconButton';
import { brandConfig } from '@/config/brand';

export function Footer() {
  const { textos } = useLanguage();

  return (
    <footer className="border-t border-border bg-surface/80" id="contato">
      <Container className="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-text">{textos.brand.name}</p>
          <p className="mt-1 text-sm text-text-muted">{textos.brand.location}</p>
          <p className="mt-1 text-xs text-text-muted">
            © {new Date().getFullYear()} {textos.footer.rights}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            aria-label={textos.accessibility.openGithub}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-full)] text-text-muted transition-colors hover:bg-surface-secondary hover:text-text"
            href={brandConfig.socialLinks.github}
            rel="noreferrer"
            target="_blank"
          >
            <GitHubIcon aria-hidden="true" fontSize="inherit" />
          </Link>
          <Link
            aria-label={textos.accessibility.openLinkedin}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-full)] text-text-muted transition-colors hover:bg-surface-secondary hover:text-text"
            href={brandConfig.socialLinks.linkedin}
            rel="noreferrer"
            target="_blank"
          >
            <LinkedInIcon aria-hidden="true" fontSize="inherit" />
          </Link>
          <IconButton
            disabled={!brandConfig.email}
            label={textos.accessibility.unavailableEmail}
            variant="ghost"
          >
            <EmailOutlinedIcon aria-hidden="true" fontSize="inherit" />
          </IconButton>
          <Link
            aria-label={textos.footer.backToTop}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-full)] bg-primary text-primary-foreground shadow-[var(--shadow-glow)] transition-colors hover:bg-primary-hover"
            href="#inicio"
          >
            <KeyboardArrowUpIcon aria-hidden="true" fontSize="inherit" />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
