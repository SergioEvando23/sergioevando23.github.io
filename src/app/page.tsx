import Link from 'next/link';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CodeIcon from '@mui/icons-material/Code';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import StorageIcon from '@mui/icons-material/Storage';
import { Carousel } from '@/components/carousel/Carousel';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';
import { brandConfig } from '@/config/brand';
import { carouselItems } from '@/data/carousel';
import { experienceItems } from '@/data/experience';
import { skillGroups } from '@/data/skills';

const domainIcons = [CodeIcon, SmartphoneIcon, StorageIcon];

export default function Home() {
  return (
    <>
      <Header />
      <main id="inicio">
        <section className="py-16 sm:py-20 lg:py-24">
          <Container className="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
            <div className="flex flex-col gap-7">
              <div className="flex flex-wrap gap-2">
                <Tag variant="primary">{brandConfig.initials}</Tag>
                <Tag variant="accent">{brandConfig.location}</Tag>
              </div>
              <div className="flex flex-col gap-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  {brandConfig.name}
                </p>
                <h1 className="max-w-4xl text-4xl font-black leading-tight text-text sm:text-5xl lg:text-6xl">
                  {brandConfig.role}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-text-muted">
                  {brandConfig.description}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  href="#projetos"
                  leftIcon={<FolderOutlinedIcon aria-hidden="true" />}
                >
                  Ver projetos
                </Button>
                <Button
                  href="/curriculo-sergio-costa.pdf"
                  leftIcon={<DownloadOutlinedIcon aria-hidden="true" />}
                  variant="secondary"
                >
                  Baixar currículo
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
                  GitHub
                </Link>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted transition-colors hover:text-primary"
                  href={brandConfig.socialLinks.linkedin}
                  rel="noreferrer"
                  target="_blank"
                >
                  <LinkedInIcon aria-hidden="true" fontSize="small" />
                  LinkedIn
                </Link>
              </div>
            </div>

            <Carousel
              ariaLabel="Carrossel principal de competências"
              autoPlay
              className="lg:justify-self-end"
              items={carouselItems}
              loop
              size="large"
            />
          </Container>
        </section>

        <section className="py-14" id="projetos">
          <Container className="flex flex-col gap-10">
            <SectionHeading
              description="O carrossel é whitelabel, responsivo e pode ser reutilizado em páginas internas do portfólio."
              eyebrow="Playground"
              title="Variantes do carrossel"
            />
            <div className="grid gap-8">
              <Carousel
                ariaLabel="Carrossel pequeno"
                items={carouselItems}
                size="small"
              />
              <Carousel ariaLabel="Carrossel médio" items={carouselItems} size="medium" />
              <Carousel
                ariaLabel="Carrossel grande"
                autoPlay
                items={carouselItems}
                loop
                size="large"
              />
            </div>
          </Container>
        </section>

        <section className="py-14" id="tecnologias">
          <Container className="flex flex-col gap-10">
            <SectionHeading
              description="Áreas centrais para evoluir produtos web e mobile com arquitetura consistente."
              eyebrow="Stack"
              title="Tecnologias e foco técnico"
            />
            <div className="grid gap-5 md:grid-cols-3">
              {skillGroups.map((group, index) => {
                const Icon = domainIcons[index] ?? CodeIcon;

                return (
                  <article
                    className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-6 shadow-[var(--shadow-card)] backdrop-blur"
                    key={group.id}
                  >
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-surface-secondary text-primary">
                      <Icon aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-text">{group.title}</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {group.items.map((item) => (
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
              description="Base preparada para receber páginas completas de projetos, experiência e conteúdo."
              eyebrow="Arquitetura"
              title="Pronto para evoluir"
            />
            <div className="grid gap-5 md:grid-cols-2">
              {experienceItems.map((item) => (
                <article
                  className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-6 shadow-[var(--shadow-card)]"
                  key={item.id}
                >
                  <h3 className="text-xl font-bold text-text">{item.title}</h3>
                  <p className="mt-3 leading-7 text-text-muted">{item.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Continuar evolução
                    <ArrowForwardIcon aria-hidden="true" fontSize="small" />
                  </span>
                </article>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
