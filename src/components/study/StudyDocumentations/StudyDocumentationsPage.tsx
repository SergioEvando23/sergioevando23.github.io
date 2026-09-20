'use client';

import { useMemo, useState } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CodeIcon from '@mui/icons-material/Code';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import TerminalIcon from '@mui/icons-material/Terminal';
import { useAuth } from '@/components/auth';
import { useLanguage } from '@/components/language';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { IconButton } from '@/components/ui/IconButton';
import { Tag } from '@/components/ui/Tag';
import {
  studyDocumentationCategories,
  studyDocumentations,
} from '@/data/studyDocumentations';
import { cn } from '@/lib/cn';
import type {
  StudyDocumentation,
  StudyDocumentationCategory,
} from '@/types/studyDocumentation';
import { MarkdownRenderer } from './MarkdownRenderer';

const ADMIN_EMAIL = 'sergioevandocosta@gmail.com';

const iconMap: Record<StudyDocumentation['icon'], React.ElementType> = {
  brain: PsychologyAltOutlinedIcon,
  code: CodeIcon,
  layers: LayersOutlinedIcon,
  chart: BarChartIcon,
  document: ArticleOutlinedIcon,
  terminal: TerminalIcon,
  book: MenuBookOutlinedIcon,
  people: GroupsOutlinedIcon,
};

const filterIconMap: Record<StudyDocumentationCategory, React.ElementType> = {
  all: GridViewIcon,
  aiLlms: PsychologyAltOutlinedIcon,
  development: CodeIcon,
  architecture: LayersOutlinedIcon,
  career: BarChartIcon,
  bestPractices: LightbulbOutlinedIcon,
  others: MoreHorizIcon,
};

function canUseAdminActions(user: ReturnType<typeof useAuth>['user'], isAdmin: boolean) {
  return (
    isAdmin ||
    (Boolean(user) && user?.email === ADMIN_EMAIL && user.emailVerified === true)
  );
}

export function StudyDocumentationsPage() {
  const { idioma, textos } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [activeCategory, setActiveCategory] =
    useState<StudyDocumentationCategory>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(studyDocumentations[0]?.id ?? '');
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

  const filteredDocs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return studyDocumentations.filter((documentation) => {
      const translation =
        textos.studyDocumentations.items[documentation.translationKey];
      const categoryMatches =
        activeCategory === 'all' || documentation.category === activeCategory;
      const searchable = [
        translation.title,
        translation.summary,
        textos.studyDocumentations.filters[documentation.category],
        ...documentation.tags,
      ]
        .join(' ')
        .toLowerCase();

      return categoryMatches && searchable.includes(normalizedSearch);
    });
  }, [activeCategory, search, textos]);

  const selectedDocumentation =
    filteredDocs.find((documentation) => documentation.id === selectedId) ??
    filteredDocs[0] ??
    studyDocumentations[0];
  const selectedTranslation =
    textos.studyDocumentations.items[selectedDocumentation.translationKey];
  const SelectedIcon = iconMap[selectedDocumentation.icon];

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
          <blockquote className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-6 text-right text-text-muted shadow-[var(--shadow-card)]">
            <p className="text-lg italic leading-8">
              &quot;{textos.studyDocumentations.quote}&quot;
            </p>
            <cite className="mt-3 block text-sm font-semibold not-italic text-text">
              - Sergio Costa
            </cite>
          </blockquote>
        </Container>
      </section>

      <section className="py-10">
        <Container className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.9fr)]">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div
                aria-label={textos.studyDocumentations.allResults}
                className="flex flex-wrap gap-2"
              >
                {studyDocumentationCategories.map((category) => {
                  const Icon = filterIconMap[category];
                  const selected = activeCategory === category;

                  return (
                    <button
                      aria-pressed={selected}
                      className={cn(
                        'inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-full)] border px-4 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent',
                        selected
                          ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]'
                          : 'border-border bg-surface/80 text-text-muted hover:border-primary hover:text-primary',
                      )}
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      type="button"
                    >
                      <Icon aria-hidden="true" fontSize="small" />
                      {textos.studyDocumentations.filters[category]}
                    </button>
                  );
                })}
              </div>

              <label className="relative block min-w-0 lg:w-96">
                <span className="sr-only">{textos.studyDocumentations.searchLabel}</span>
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
            </div>

            <div
              aria-label={textos.studyDocumentations.listLabel}
              className="grid gap-4 lg:grid-cols-2"
            >
              {filteredDocs.map((documentation) => {
                const translation =
                  textos.studyDocumentations.items[documentation.translationKey];
                const selected = documentation.id === selectedDocumentation.id;
                const Icon = iconMap[documentation.icon];

                return (
                  <button
                    className={cn(
                      'group rounded-[var(--radius-lg)] border bg-surface/80 p-5 text-left shadow-[var(--shadow-card)] transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-accent',
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
                        <Icon aria-hidden="true" fontSize="medium" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap gap-2">
                          <Tag variant="primary">
                            {
                              textos.studyDocumentations.filters[
                                documentation.category
                              ]
                            }
                          </Tag>
                        </span>
                        <span className="mt-3 block text-lg font-black text-text">
                          {translation.title}
                        </span>
                        <span className="mt-2 line-clamp-3 block text-sm leading-6 text-text-muted">
                          {translation.summary}
                        </span>
                      </span>
                      <span className="mt-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-full)] bg-surface-secondary text-primary transition-transform group-hover:translate-x-1">
                        <ArrowForwardIcon aria-hidden="true" fontSize="small" />
                      </span>
                    </div>
                    <span className="mt-5 flex flex-wrap gap-4 text-xs text-text-muted">
                      <span className="inline-flex items-center gap-2">
                        <CalendarTodayIcon aria-hidden="true" fontSize="small" />
                        {dateFormatter.format(new Date(documentation.date))}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <AccessTimeIcon aria-hidden="true" fontSize="small" />
                        {textos.studyDocumentations.minutes(
                          documentation.readTimeMinutes,
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredDocs.length === 0 ? (
              <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 text-text-muted">
                {textos.studyDocumentations.empty}
              </div>
            ) : null}
          </div>

          <article
            aria-label={textos.studyDocumentations.readerLabel}
            className="sticky top-24 flex max-h-[calc(100vh-8rem)] min-h-[640px] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface/80 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-border p-5">
              <Button
                leftIcon={<ArrowBackIcon aria-hidden="true" />}
                onClick={() => setSelectedId(filteredDocs[0]?.id ?? selectedId)}
                size="small"
                variant="ghost"
              >
                {textos.studyDocumentations.backToList}
              </Button>
              {adminAllowed ? (
                <div className="flex gap-2">
                  <Button
                    leftIcon={<EditOutlinedIcon aria-hidden="true" />}
                    size="small"
                    variant="secondary"
                  >
                    {textos.studyDocumentations.admin.edit}
                  </Button>
                  <IconButton
                    label={textos.studyDocumentations.admin.moreActions}
                    size="small"
                    variant="ghost"
                  >
                    <MoreVertIcon aria-hidden="true" fontSize="inherit" />
                  </IconButton>
                </div>
              ) : (
                <p className="text-xs text-text-muted">
                  {textos.studyDocumentations.admin.readOnlyNotice}
                </p>
              )}
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
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-secondary text-primary">
                  <SelectedIcon aria-hidden="true" fontSize="medium" />
                </span>
                <div>
                  <h2 className="text-3xl font-black text-text">
                    {selectedTranslation.title}
                  </h2>
                  <dl className="mt-4 flex flex-wrap gap-5 text-sm text-text-muted">
                    <div className="inline-flex items-center gap-2">
                      <CalendarTodayIcon aria-hidden="true" fontSize="small" />
                      <dt className="sr-only">{textos.studyDocumentations.dateLabel}</dt>
                      <dd>{dateFormatter.format(new Date(selectedDocumentation.date))}</dd>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <AccessTimeIcon aria-hidden="true" fontSize="small" />
                      <dt className="sr-only">
                        {textos.studyDocumentations.readTimeLabel}
                      </dt>
                      <dd>
                        {textos.studyDocumentations.minutes(
                          selectedDocumentation.readTimeMinutes,
                        )}
                      </dd>
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <GroupsOutlinedIcon aria-hidden="true" fontSize="small" />
                      <dt className="sr-only">{textos.studyDocumentations.authorLabel}</dt>
                      <dd>{selectedDocumentation.author}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <MarkdownRenderer
                copyLabel={textos.studyDocumentations.admin.moreActions}
                lines={selectedTranslation.body}
              />
            </div>

            <div className="border-t border-border p-5">
              {adminAllowed ? (
                <Button leftIcon={<AddIcon aria-hidden="true" />} size="large">
                  {textos.studyDocumentations.admin.newDocumentation}
                </Button>
              ) : (
                <Button rightIcon={<ArrowForwardIcon aria-hidden="true" />} size="large">
                  {textos.studyDocumentations.continueReading}
                </Button>
              )}
            </div>
          </article>
        </Container>
      </section>
    </main>
  );
}
