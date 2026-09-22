'use client';

import { useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useLanguage } from '@/components/language';
import { IconButton } from '@/components/ui/IconButton';
import { getProjectIframeSandbox, isValidProjectUrl } from '@/services/study/projectPreview';
import type { StudyProject } from '@/types/firebase/studyProject';

interface ProjectPlaygroundProps {
  project: StudyProject;
  onClose: () => void;
}

export function ProjectPlayground({ project, onClose }: ProjectPlaygroundProps) {
  const { textos } = useLanguage();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const fullscreenSupported =
    typeof document !== 'undefined' && Boolean(document.fullscreenEnabled);

  const validUrl = isValidProjectUrl(project.demoUrl);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, project.id]);

  const openFullscreen = async () => {
    if (dialogRef.current?.requestFullscreen) {
      await dialogRef.current.requestFullscreen();
    }
  };

  return (
    <div
      aria-label={textos.studyGallery.playground.dialogLabel(project.title)}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-0 backdrop-blur-sm md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      ref={dialogRef}
      role="dialog"
      tabIndex={-1}
    >
      <section className="flex h-[100dvh] w-screen flex-col overflow-hidden border-border bg-surface shadow-[var(--shadow-card)] md:h-[90vh] md:w-[min(1400px,95vw)] md:rounded-[var(--radius-xl)] md:border">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
          <h2 className="min-w-0 truncate text-lg font-black text-text">{project.title}</h2>
          <div className="flex gap-2">
            {validUrl ? <a aria-label={textos.studyGallery.playground.openExternal} className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-full)] text-text-muted hover:bg-surface-secondary hover:text-text" href={project.demoUrl} rel="noopener noreferrer" target="_blank"><OpenInNewIcon aria-hidden="true" /></a> : null}
            {fullscreenSupported && project.preview?.allowFullscreen !== false ? <IconButton label={textos.studyGallery.playground.fullscreen} onClick={() => void openFullscreen()} variant="ghost"><FullscreenIcon aria-hidden="true" /></IconButton> : null}
            <IconButton label={textos.studyGallery.playground.close} onClick={onClose} variant="ghost"><CloseIcon aria-hidden="true" /></IconButton>
          </div>
        </header>
        <div className="relative min-h-0 flex-1 bg-surface-secondary">
          {!loaded && !failed && validUrl ? <p className="absolute inset-0 grid place-items-center text-text-muted">{textos.studyGallery.playground.loading}</p> : null}
          {failed || !validUrl ? <div className="grid h-full place-items-center p-6 text-center"><div><p className="text-text-muted">{textos.studyGallery.playground.error}</p>{validUrl ? <a className="mt-4 inline-flex rounded-[var(--radius-full)] bg-primary px-5 py-3 font-semibold text-primary-foreground" href={project.demoUrl} rel="noopener noreferrer" target="_blank">{textos.studyGallery.playground.openExternal}</a> : null}</div></div> : <iframe allowFullScreen={project.preview?.allowFullscreen !== false} className="h-full w-full border-0" onError={() => setFailed(true)} onLoad={() => setLoaded(true)} sandbox={getProjectIframeSandbox(project)} src={project.demoUrl} title={project.title} />}
        </div>
      </section>
    </div>
  );
}
