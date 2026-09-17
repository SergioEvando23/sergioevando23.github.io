'use client';

import Image from 'next/image';
import GitHubIcon from '@mui/icons-material/GitHub';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useLanguage } from '@/components/language';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';
import { useStudyProjects } from '@/hooks/useStudyProjects';

export function StudyGallery() {
  const { textos } = useLanguage();
  const { projects, loading, error, retry } = useStudyProjects();

  return (
    <section className="py-14" id="galeria-estudos">
      <Container className="flex flex-col gap-10">
        <SectionHeading
          description={textos.studyGallery.description}
          eyebrow={textos.studyGallery.eyebrow}
          title={textos.studyGallery.title}
        />

        {loading ? (
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
            {textos.studyGallery.loading}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="flex flex-col items-start gap-4 rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
            <p>{textos.studyGallery.error}</p>
            <Button
              leftIcon={<RefreshIcon aria-hidden="true" />}
              onClick={() => void retry()}
              variant="secondary"
            >
              {textos.studyGallery.retry}
            </Button>
          </div>
        ) : null}

        {!loading && !error && projects.length === 0 ? (
          <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
            {textos.studyGallery.empty}
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
                          cover.alt || textos.studyGallery.imageAltFallback(project.title)
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
                          {textos.studyGallery.focus}
                        </dt>
                        <dd>{project.focus}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-text">
                          {textos.studyGallery.period}
                        </dt>
                        <dd>{period}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-text">
                          {textos.studyGallery.category}
                        </dt>
                        <dd>{project.category}</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-text">
                          {textos.studyGallery.kind}
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
                      {textos.studyGallery.github}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
