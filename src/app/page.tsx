'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import StorageIcon from '@mui/icons-material/Storage';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import { Carousel } from '@/components/carousel/Carousel';
import { useLanguage } from '@/components/language';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';
import { brandConfig } from '@/config/brand';
import { curriculos } from '@/config/curriculos';
import { carouselItems } from '@/data/carousel';
import { experienceItems } from '@/data/experience';
import { skillGroups } from '@/data/skills';
import type { CarouselImage } from '@/types/carousel';

const domainIcons = [
  CodeIcon,
  SmartphoneIcon,
  StorageIcon,
  MonitorHeartOutlinedIcon,
  FactCheckOutlinedIcon,
];

function HomeContent() {
  const { textos } = useLanguage();
  const translatedCarouselItems = useMemo<CarouselImage[]>(
    () =>
      carouselItems.map((item) => ({
        ...item,
        ...textos.carousel.items[item.translationKey],
      })),
    [textos],
  );
  const highlightedRoleIndex = textos.brand.role.indexOf(textos.brand.highlightedRole);
  const roleBeforeHighlight =
    highlightedRoleIndex >= 0
      ? textos.brand.role.slice(0, highlightedRoleIndex)
      : textos.brand.role;
  const roleAfterHighlight =
    highlightedRoleIndex >= 0
      ? textos.brand.role.slice(
          highlightedRoleIndex + textos.brand.highlightedRole.length,
        )
      : '';

  return (
    <>
      <Header />
      <main id="inicio">
        <section className="py-16 sm:py-20 lg:py-24">
          <Container className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
            <div className="flex flex-col gap-7">
              <div className="flex flex-wrap gap-2">
                <Tag variant="primary">{textos.brand.initials}</Tag>
                <Tag variant="accent">{textos.brand.location}</Tag>
              </div>
              <div className="flex flex-col gap-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  {textos.hero.eyebrow} {textos.brand.name}
                </p>
                <h1 className="max-w-4xl text-4xl font-black leading-tight text-text sm:text-5xl lg:text-6xl">
                  {roleBeforeHighlight}
                  <span className="text-primary">{textos.brand.highlightedRole}</span>
                  {roleAfterHighlight}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-text-muted">
                  {textos.brand.description}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button
                  href="#galeria-estudos"
                  leftIcon={<FolderOutlinedIcon aria-hidden="true" />}
                >
                  {textos.hero.viewProjects}
                </Button>
                <Button
                  download={curriculos.portugues.fileName}
                  href={curriculos.portugues.href}
                  leftIcon={<DownloadOutlinedIcon aria-hidden="true" />}
                  variant="secondary"
                >
                  {textos.resume.downloadPortuguese}
                </Button>
                <Button
                  download={curriculos.ingles.fileName}
                  href={curriculos.ingles.href}
                  leftIcon={<DownloadOutlinedIcon aria-hidden="true" />}
                  variant="secondary"
                >
                  {textos.resume.downloadEnglish}
                </Button>
              </div>
              <div className="flex gap-3">
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-primary"
                  href={brandConfig.socialLinks.github}
                  rel="noreferrer"
                  target="_blank"
                >
                  <GitHubIcon aria-hidden="true" fontSize="small" />
                  {textos.hero.githubLabel}
                </Link>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-primary"
                  href={brandConfig.socialLinks.linkedin}
                  rel="noreferrer"
                  target="_blank"
                >
                  <LinkedInIcon aria-hidden="true" fontSize="small" />
                  {textos.hero.linkedinLabel}
                </Link>
              </div>
            </div>

            <Carousel
              ariaLabel={textos.carousel.mainLabel}
              autoPlay
              className="lg:justify-self-end"
              items={translatedCarouselItems}
              loop
              size="large"
            />
          </Container>
        </section>

        <section className="py-14" id="tecnologias">
          <Container className="flex flex-col gap-10">
            <SectionHeading
              description={textos.sections.technologies.description}
              eyebrow={textos.sections.technologies.eyebrow}
              title={textos.sections.technologies.title}
            />
            <div className="grid gap-5 md:grid-cols-3">
              {skillGroups.map((group, index) => {
                const Icon = domainIcons[index] ?? CodeIcon;
                const translatedGroup = textos.skills.groups[group.translationKey];

                return (
                  <article
                    className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-6 shadow-[var(--shadow-card)] backdrop-blur"
                    key={group.id}
                  >
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-surface-secondary text-primary">
                      <Icon aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-text">
                      {translatedGroup.title}
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {translatedGroup.items.map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        <section className="py-14" id="experiencia">
          <Container className="flex flex-col gap-8">
            <SectionHeading
              description={textos.sections.architecture.description}
              eyebrow={textos.sections.architecture.eyebrow}
              title={textos.sections.architecture.title}
            />
            <div className="grid gap-5 md:grid-cols-2">
              {experienceItems.map((item) => {
                const translatedItem = textos.experience.items[item.translationKey];

                return (
                  <article
                    className="flex h-full flex-col rounded-[var(--radius-xl)] border border-border bg-surface/80 p-6 shadow-[var(--shadow-card)]"
                    key={item.id}
                  >
                    <h3 className="text-xl font-bold text-text">
                      {translatedItem.title}
                    </h3>
                    <p className="mt-3 leading-7 text-text-muted">
                      {translatedItem.description}
                    </p>
                    <Link
                      className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary transition-colors hover:text-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                      href="/study/documentations/"
                    >
                      {textos.sections.architecture.continueEvolution}
                      <ArrowForwardIcon aria-hidden="true" fontSize="small" />
                    </Link>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function Home() {
  return <HomeContent />;
}
