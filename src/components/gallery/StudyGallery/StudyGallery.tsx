'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useLanguage } from '@/components/language';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';
import { useStudyProjects } from '@/hooks/useStudyProjects';
import { ProjectPlayground } from '@/components/gallery/ProjectPlayground';
import { canRunProject } from '@/services/study/projectPreview';
import type { StudyProject } from '@/types/firebase/studyProject';

export function StudyGallery() {
  const { translations } = useLanguage();
  const { projects, loading, error, retry } = useStudyProjects();
  const [selectedProject, setSelectedProject] = useState<StudyProject | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const highlightedIndex = translations.studyGallery.title.indexOf(
    translations.studyGallery.highlightedTitle,
  );
  const titleBeforeHighlight =
    highlightedIndex >= 0
      ? translations.studyGallery.title.slice(0, highlightedIndex)
      : translations.studyGallery.title;
  const titleAfterHighlight =
    highlightedIndex >= 0
      ? translations.studyGallery.title.slice(
          highlightedIndex + translations.studyGallery.highlightedTitle.length,
        )
      : '';

  return (
    <section className="py-14" id="galeria-estudos">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          description={translations.studyGallery.description}
          eyebrow={translations.studyGallery.eyebrow}
          title={
            <>
              {titleBeforeHighlight}
              <span className="text-primary">
                {translations.studyGallery.highlightedTitle}
              </span>
              {titleAfterHighlight}
            </>
          }
        />

        {loading ? (
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
            {translations.studyGallery.loading}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="flex flex-col items-start gap-4 rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
            <p>{translations.studyGallery.error}</p>
            <Button
              leftIcon={<RefreshIcon aria-hidden="true" />}
              onClick={() => void retry()}
              variant="secondary"
            >
              {translations.studyGallery.retry}
            </Button>
          </div>
        ) : null}

        {!loading && !error && projects.length === 0 ? (
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
            {translations.studyGallery.empty}
          </div>
        ) : null}

        {!loading && !error && projects.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((project) => {
              const cover =
                project.galleryImages.find((image) => image.isCover) ??
                project.galleryImages[0];
              const period =
                project.startedAt && project.completedAt
                  ? `${project.startedAt} - ${project.completedAt}`
                  : project.date;

              return (
                <article
                  className="overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface/80 shadow-[var(--shadow-card)]"
                  key={project.id}
                >
                  <div className="relative aspect-[16/9] bg-surface-secondary">
                    {cover ? (
                      <Image
                        alt={
                          cover.alt || translations.studyGallery.imageAltFallback(project.title)
                        }
                        className="object-cover"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        src={cover.url}
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-4 p-6">
                    <div>
                      <h3 className="text-2xl font-black text-text">{project.title}</h3>
                      <p className="mt-3 leading-7 text-text-muted">
                        {project.description}
                      </p>
                    </div>
                    <dl className="grid gap-3 text-sm text-text-muted sm:grid-cols-2">
                      <div>
                        <dt className="font-bold text-text">
                          {translations.studyGallery.focus}
                        </dt>
                        <dd>{project.focus}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-text">
                          {translations.studyGallery.period}
                        </dt>
                        <dd>{period}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-text">
                          {translations.studyGallery.category}
                        </dt>
                        <dd>{project.category}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-text">
                          {translations.studyGallery.kind}
                        </dt>
                        <dd>{project.kind}</dd>
                      </div>
                    </dl>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <Tag key={technology}>{technology}</Tag>
                      ))}
                    </div>
                    <Button
                      href={project.githubUrl}
                      leftIcon={<GitHubIcon aria-hidden="true" />}
                      rel="noreferrer"
                      target="_blank"
                      variant="secondary"
                    >
                      {translations.studyGallery.github}
                    </Button>
                    {canRunProject(project) ? (
                      <Button
                        leftIcon={<PlayArrowIcon aria-hidden="true" />}
                        onClick={(event) => {
                          triggerRef.current = event.currentTarget;
                          setSelectedProject(project);
                        }}
                      >
                        {translations.studyGallery.playground.run}
                      </Button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </Container>
      {selectedProject ? (
        <ProjectPlayground
          key={selectedProject.id}
          onClose={() => {
            setSelectedProject(null);
            window.setTimeout(() => triggerRef.current?.focus(), 0);
          }}
          project={selectedProject}
        />
      ) : null}
    </section>
  );
}
