'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '@/components/auth';
import { useLanguage } from '@/components/language';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Tag } from '@/components/ui/Tag';
import { cn } from '@/lib/cn';
import { getAllDocumentations } from '@/services/firebase/studyDocumentationService';
import type { StudyDocumentation } from '@/types/firebase/studyDocumentation';
import { MarkdownRenderer } from './MarkdownRenderer';

const ADMIN_EMAIL = 'sergioevandocosta@gmail.com';
const ALL_TAG = '__all__';

function canUseAdminActions(user: ReturnType<typeof useAuth>['user'], isAdmin: boolean) {
  return (
    isAdmin ||
    (Boolean(user) && user?.email === ADMIN_EMAIL && user.emailVerified === true)
  );
}

function isAiDocumentation(documentation: StudyDocumentation) {
  const searchable = `${documentation.title} ${documentation.tags.join(' ')}`.toLowerCase();

  return searchable.includes('ia') || searchable.includes('llm') || searchable.includes('rag');
}

function renderDocumentationIcon(documentation: StudyDocumentation, fontSize: 'small' | 'medium') {
  return isAiDocumentation(documentation) ? (
    <PsychologyAltOutlinedIcon aria-hidden="true" fontSize={fontSize} />
  ) : (
    <ArticleOutlinedIcon aria-hidden="true" fontSize={fontSize} />
  );
}

function summarizeMarkdown(markdown: string) {
  return markdown.replace(/[#*_`>|-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 140);
}

function estimateReadTime(markdown: string) {
  return Math.max(1, Math.ceil(markdown.length / 900));
}

export function StudyDocumentationsPage() {
  const { idioma, textos } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [documentations, setDocumentations] = useState<StudyDocumentation[]>([]);
  const [activeTag, setActiveTag] = useState(ALL_TAG);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const adminAllowed = canUseAdminActions(user, isAdmin);
  const highlightedIndex = textos.studyDocumentations.title.indexOf(
    textos.studyDocumentations.highlightedTitle,
  );
  const titleBeforeHighlight =
    highlightedIndex >= 0
      ? textos.studyDocumentations.title.slice(0, highlightedIndex)
      : textos.studyDocumentations.title;
  const titleAfterHighlight =
    highlightedIndex >= 0
      ? textos.studyDocumentations.title.slice(
          highlightedIndex + textos.studyDocumentations.highlightedTitle.length,
        )
      : '';

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(idioma === 'portugues' ? 'pt-BR' : 'en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    [idioma],
  );

  const loadDocumentations = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const items = await getAllDocumentations();
      setDocumentations(items);
      setSelectedId((current) =>
        items.some((item) => item.id === current) ? current : (items[0]?.id ?? ''),
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadDocumentations();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadDocumentations]);

  const availableTags = useMemo(
    () =>
      Array.from(new Set(documentations.flatMap((documentation) => documentation.tags))).sort(
        (left, right) => left.localeCompare(right),
      ),
    [documentations],
  );

  const filteredDocs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return documentations.filter((documentation) => {
      const tagMatches = activeTag === ALL_TAG || documentation.tags.includes(activeTag);
      const searchable = [
        documentation.title,
        documentation.author,
        documentation.content,
        ...documentation.tags,
      ]
        .join(' ')
        .toLowerCase();

      return tagMatches && searchable.includes(normalizedSearch);
    });
  }, [activeTag, documentations, search]);

  const selectedDocumentation =
    filteredDocs.find((documentation) => documentation.id === selectedId) ??
    filteredDocs[0] ??
    documentations[0];

  return (
    <main>
      <section className="border-b border-border bg-background/70 py-12">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
              {textos.studyDocumentations.eyebrow}
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-text sm:text-5xl">
              {titleBeforeHighlight}
              <span className="text-primary">
                {textos.studyDocumentations.highlightedTitle}
              </span>
              {titleAfterHighlight}
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-text-muted">
              {textos.studyDocumentations.description}
            </p>
          </div>
          <blockquote className="rounded-[var(--radius-xl)] bg-surface/80 p-6 text-right text-text-muted shadow-[var(--shadow-card)]">
            <p className="text-lg italic leading-8">
              &quot;{textos.studyDocumentations.quote}&quot;
            </p>
            <cite className="mt-3 block text-sm font-semibold not-italic text-text">
              - Sérgio Costa
            </cite>
          </blockquote>
        </Container>
      </section>

      <section className="py-8 lg:py-12">
        <Container className="grid gap-8 xl:grid-cols-[minmax(320px,0.55fr)_minmax(0,1.45fr)]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:items-start">
              <div
                aria-label={textos.studyDocumentations.allResults}
                className="flex flex-wrap gap-2"
              >
                {[ALL_TAG, ...availableTags].map((tag) => {
                  const selected = activeTag === tag;
                  const label =
                    tag === ALL_TAG ? textos.studyDocumentations.filters.all : tag;

                  return (
                    <button
                      aria-pressed={selected}
                      className={cn(
                        'inline-flex min-h-8 items-center gap-3 rounded-[var(--radius-full)] border px-8 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-30 focus-visible:outline-offset-3 focus-visible:outline-accent',
                        selected
                          ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]'
                          : 'border-border bg-surface/80 text-text-muted hover:border-primary hover:text-primary',
                      )}
                      key={tag}
                      onClick={() => setActiveTag(tag)}
                      type="button"
                    >
                      <ArticleOutlinedIcon aria-hidden="true" fontSize="small" />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 lg:flex-row">
                <label className="relative block min-w-0 lg:w-96">
                  <span className="sr-only">
                    {textos.studyDocumentations.searchLabel}
                  </span>
                  <SearchIcon
                    aria-hidden="true"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
                    fontSize="small"
                  />
                  <input
                    className="min-h-12 w-full rounded-[var(--radius-lg)] border border-border bg-surface/80 py-3 pl-12 pr-4 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={textos.studyDocumentations.searchPlaceholder}
                    type="search"
                    value={search}
                  />
                </label>
                {adminAllowed ? (
                  <Button
                    href="/study/documentations/admin"
                    leftIcon={<AddIcon aria-hidden="true" />}
                    size="medium"
                  >
                    {textos.studyDocumentations.admin.newDocumentation}
                  </Button>
                ) : null}
              </div>
            </div>

            {loading ? (
              <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
                {textos.studyDocumentations.loading}
              </div>
            ) : null}

            {!loading && error ? (
              <div className="flex flex-col items-start gap-4 rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
                <p>{textos.studyDocumentations.error}</p>
                <Button
                  leftIcon={<RefreshIcon aria-hidden="true" />}
                  onClick={() => void loadDocumentations()}
                  variant="secondary"
                >
                  {textos.studyDocumentations.retry}
                </Button>
              </div>
            ) : null}

            {!loading && !error && filteredDocs.length === 0 ? (
              <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
                {textos.studyDocumentations.empty}
              </div>
            ) : null}

            {!loading && !error ? (
              <div
                aria-label={textos.studyDocumentations.listLabel}
                className="grid gap-3"
              >
                {filteredDocs.map((documentation) => {
                  const selected = documentation.id === selectedDocumentation?.id;
                  return (
                    <button
                      className={cn(
                        'group rounded-[var(--radius-lg)] border bg-surface/80 p-4 text-left shadow-[var(--shadow-card)] transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent',
                        selected
                          ? 'border-primary shadow-[var(--shadow-glow)]'
                          : 'border-border hover:border-primary',
                      )}
                      key={documentation.id}
                      onClick={() => setSelectedId(documentation.id)}
                      type="button"
                    >
                      <div className="flex items-start gap-4">
                        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-secondary text-primary">
                          {renderDocumentationIcon(documentation, 'medium')}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap gap-2">
                            {documentation.tags.slice(0, 2).map((tag) => (
                              <Tag key={tag} variant="primary">
                                {tag}
                              </Tag>
                            ))}
                          </span>
                          <span className="mt-2 block text-base font-black text-text">
                            {documentation.title}
                          </span>
                          <span className="mt-1 line-clamp-2 block text-sm leading-6 text-text-muted">
                            {summarizeMarkdown(documentation.content)}
                          </span>
                        </span>
                      </div>
                      <span className="mt-3 flex flex-wrap gap-4 text-xs text-text-muted">
                        <span className="inline-flex items-center gap-2">
                          <CalendarTodayIcon aria-hidden="true" fontSize="small" />
                          {dateFormatter.format(new Date(documentation.updatedAt))}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <AccessTimeIcon aria-hidden="true" fontSize="small" />
                          {textos.studyDocumentations.minutes(
                            estimateReadTime(documentation.content),
                          )}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <article
            aria-label={textos.studyDocumentations.readerLabel}
            className="sticky top-24 flex max-h-[calc(100vh-8rem)] min-h-[680px] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface/80 shadow-[var(--shadow-card)]"
          >
            {selectedDocumentation ? (
              <>
                <div className="flex items-center justify-between gap-3 border-b border-border p-5">
                  <p className="text-sm font-semibold text-text-muted">
                    {textos.studyDocumentations.admin.readOnlyNotice}
                  </p>
                  {adminAllowed ? (
                    <Button
                      href={`/study/documentations/admin?id=${selectedDocumentation.id}`}
                      leftIcon={<EditOutlinedIcon aria-hidden="true" />}
                      size="small"
                      variant="secondary"
                    >
                      {textos.studyDocumentations.admin.edit}
                    </Button>
                  ) : null}
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-6">
                  <div className="mb-5 flex flex-wrap gap-2">
                    {selectedDocumentation.tags.map((tag) => (
                      <Tag key={tag} variant={tag.length > 8 ? 'accent' : 'primary'}>
                        {tag}
                      </Tag>
                    ))}
                  </div>

                  <div className="mb-6 flex items-start gap-4">
                    <span className="flex h-12 w-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-secondary text-primary">
                      {renderDocumentationIcon(selectedDocumentation, 'medium')}
                    </span>
                    <div>
                      <h2 className="text-3xl font-black text-text">
                        {selectedDocumentation.title}
                      </h2>
                      <dl className="mt-4 flex flex-wrap gap-5 text-sm text-text-muted">
                        <div className="inline-flex items-center gap-2">
                          <CalendarTodayIcon aria-hidden="true" fontSize="small" />
                          <dt className="sr-only">
                            {textos.studyDocumentations.dateLabel}
                          </dt>
                          <dd>
                            {dateFormatter.format(
                              new Date(selectedDocumentation.updatedAt),
                            )}
                          </dd>
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <AccessTimeIcon aria-hidden="true" fontSize="small" />
                          <dt className="sr-only">
                            {textos.studyDocumentations.readTimeLabel}
                          </dt>
                          <dd>
                            {textos.studyDocumentations.minutes(
                              estimateReadTime(selectedDocumentation.content),
                            )}
                          </dd>
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <GroupsOutlinedIcon aria-hidden="true" fontSize="small" />
                          <dt className="sr-only">
                            {textos.studyDocumentations.authorLabel}
                          </dt>
                          <dd>{selectedDocumentation.author}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <MarkdownRenderer markdown={selectedDocumentation.content} />
                </div>
              </>
            ) : (
              <div className="p-6 text-text-muted">{textos.studyDocumentations.empty}</div>
            )}
          </article>
        </Container>
      </section>
    </main>
  );
}
