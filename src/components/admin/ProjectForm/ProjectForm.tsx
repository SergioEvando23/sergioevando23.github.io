'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Alert,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SendIcon from '@mui/icons-material/Send';
import { useLanguage } from '@/components/language';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';
import { useCreateStudyProject } from '@/hooks/useCreateStudyProject';
import {
  isAllowedProjectImage,
  MAX_PROJECT_IMAGES,
  type LocalProjectImage,
} from '@/services/firebase/projectImages';
import type { StudyProjectInput } from '@/types/firebase/studyProject';
import { createProjectPreview, isValidProjectUrl } from '@/services/study/projectPreview';

type FormErrors = Partial<Record<keyof StudyProjectInput | 'images', string>>;

const initialInput: StudyProjectInput = {
  id: '',
  repository: '',
  title: '',
  description: '',
  focus: '',
  technologies: [],
  category: 'frontend',
  kind: 'study',
  startedAt: '',
  completedAt: '',
  date: '',
  githubUrl: '',
  portfolioEligible: true,
  demoUrl: '',
  preview: { enabled: false, type: 'iframe' },
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function createImageId() {
  return crypto.randomUUID();
}

export function ProjectForm() {
  const { textos } = useLanguage();
  const { create, loading, progress } = useCreateStudyProject();
  const [input, setInput] = useState<StudyProjectInput>(initialInput);
  const [technologyDraft, setTechnologyDraft] = useState('');
  const [images, setImages] = useState<LocalProjectImage[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const firstErrorRef = useRef<HTMLInputElement | null>(null);
  const dirty = useMemo(
    () => JSON.stringify(input) !== JSON.stringify(initialInput) || images.length > 0,
    [images.length, input],
  );

  useEffect(() => {
    if (!dirty) {
      return undefined;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = textos.admin.form.actions.confirmLeave;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty, textos.admin.form.actions.confirmLeave]);

  const update = <Key extends keyof StudyProjectInput>(
    key: Key,
    value: StudyProjectInput[Key],
  ) => {
    setInput((current) =>
      key === 'demoUrl'
        ? {
            ...current,
            demoUrl: value as string,
            preview: createProjectPreview(value as string, current.preview),
          }
        : { ...current, [key]: value },
    );
    setSuccess(false);
  };

  const addTechnology = () => {
    const technology = technologyDraft.trim();

    if (!technology || input.technologies.includes(technology)) {
      return;
    }

    update('technologies', [...input.technologies, technology]);
    setTechnologyDraft('');
  };

  const addImages = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const nextImages = [...images];
    const nextErrors: FormErrors = {};

    Array.from(files).forEach((file) => {
      if (nextImages.length >= MAX_PROJECT_IMAGES) {
        nextErrors.images = textos.admin.form.errors.imageLimit;
        return;
      }

      if (!isAllowedProjectImage(file)) {
        nextErrors.images =
          file.size > 5 * 1024 * 1024
            ? textos.admin.form.errors.imageSize
            : textos.admin.form.errors.imageType;
        return;
      }

      nextImages.push({
        id: createImageId(),
        file,
        alt: '',
        previewUrl: URL.createObjectURL(file),
      });
    });

    setImages(nextImages);
    setErrors((current) => ({ ...current, ...nextErrors }));
  };

  const removeImage = (id: string) => {
    setImages((current) => {
      const image = current.find((item) => item.id === id);
      if (image) {
        URL.revokeObjectURL(image.previewUrl);
      }
      return current.filter((item) => item.id !== id);
    });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((current) => {
      const target = index + direction;

      if (target < 0 || target >= current.length) {
        return current;
      }

      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!input.id) {
      nextErrors.id = textos.admin.form.errors.required;
    } else if (!slugPattern.test(input.id)) {
      nextErrors.id = textos.admin.form.errors.invalidSlug;
    }

    (
      [
        'repository',
        'title',
        'description',
        'focus',
        'category',
        'kind',
        'date',
        'githubUrl',
      ] as const
    ).forEach((key) => {
      if (!input[key]) {
        nextErrors[key] = textos.admin.form.errors.required;
      }
    });

    if (!input.githubUrl.startsWith('https://github.com/')) {
      nextErrors.githubUrl = textos.admin.form.errors.invalidGithub;
    }

    if (input.demoUrl && !isValidProjectUrl(input.demoUrl)) {
      nextErrors.demoUrl = textos.admin.form.errors.invalidDemoUrl;
    }

    if (images.length === 0) {
      nextErrors.images = textos.admin.form.errors.imageRequired;
    }

    setErrors(nextErrors);
    return nextErrors;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      firstErrorRef.current?.focus();
      return;
    }

    try {
      await create(
        input,
        images.map((image, index) => ({
          ...image,
          alt:
            image.alt.trim() ||
            textos.studyGallery.imageAltFallback(`${input.title} ${index + 1}`),
        })),
        textos.admin.form.uploadProgress,
      );
      setSuccess(true);
      setInput(initialInput);
      setImages([]);
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message === 'duplicate-id'
          ? textos.admin.form.errors.duplicateId
          : textos.admin.form.errors.saveFailed,
      );
    }
  };

  return (
    <form
      className="grid gap-8 lg:grid-cols-[1fr_360px]"
      onSubmit={(event) => void submit(event)}
    >
      <div className="flex flex-col gap-5">
        <SectionHeading
          description={textos.admin.form.description}
          eyebrow={textos.admin.insertProjects}
          title={textos.admin.form.title}
        />

        {success ? <Alert severity="success">{textos.admin.form.success}</Alert> : null}
        {submitError ? <Alert severity="error">{submitError}</Alert> : null}
        {progress ? <Alert severity="info">{progress}</Alert> : null}

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            error={Boolean(errors.id)}
            helperText={errors.id ?? textos.admin.form.helpers.id}
            inputRef={errors.id ? firstErrorRef : undefined}
            label={textos.admin.form.fields.id}
            onChange={(event) => update('id', event.target.value)}
            value={input.id}
          />
          <TextField
            error={Boolean(errors.repository)}
            helperText={errors.repository}
            label={textos.admin.form.fields.repository}
            onChange={(event) => update('repository', event.target.value)}
            value={input.repository}
          />
          <TextField
            error={Boolean(errors.title)}
            helperText={errors.title}
            label={textos.admin.form.fields.projectTitle}
            onChange={(event) => update('title', event.target.value)}
            value={input.title}
          />
          <TextField
            error={Boolean(errors.focus)}
            helperText={errors.focus}
            label={textos.admin.form.fields.focus}
            onChange={(event) => update('focus', event.target.value)}
            value={input.focus}
          />
          <TextField
            className="md:col-span-2"
            error={Boolean(errors.description)}
            helperText={errors.description}
            label={textos.admin.form.fields.projectDescription}
            minRows={4}
            multiline
            onChange={(event) => update('description', event.target.value)}
            value={input.description}
          />
          <FormControl>
            <InputLabel>{textos.admin.form.fields.category}</InputLabel>
            <Select
              label={textos.admin.form.fields.category}
              onChange={(event) => update('category', event.target.value)}
              value={input.category}
            >
              <MenuItem value="frontend">Frontend</MenuItem>
              <MenuItem value="mobile">Mobile</MenuItem>
              <MenuItem value="backend">Backend</MenuItem>
              <MenuItem value="fullstack">Fullstack</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>{textos.admin.form.fields.kind}</InputLabel>
            <Select
              label={textos.admin.form.fields.kind}
              onChange={(event) => update('kind', event.target.value)}
              value={input.kind}
            >
              <MenuItem value="study">Study</MenuItem>
              <MenuItem value="prototype">Prototype</MenuItem>
              <MenuItem value="case-study">Case study</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={textos.admin.form.fields.startedAt}
            onChange={(event) => update('startedAt', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
            value={input.startedAt}
          />
          <TextField
            label={textos.admin.form.fields.completedAt}
            onChange={(event) => update('completedAt', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
            value={input.completedAt}
          />
          <TextField
            error={Boolean(errors.date)}
            helperText={errors.date}
            label={textos.admin.form.fields.date}
            onChange={(event) => update('date', event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
            value={input.date}
          />
          <TextField
            error={Boolean(errors.githubUrl)}
            helperText={errors.githubUrl}
            label={textos.admin.form.fields.githubUrl}
            onChange={(event) => update('githubUrl', event.target.value)}
            value={input.githubUrl}
          />
          <TextField
            error={Boolean(errors.demoUrl)}
            helperText={errors.demoUrl ?? textos.admin.form.helpers.demoUrl}
            label={textos.admin.form.fields.demoUrl}
            onChange={(event) => update('demoUrl', event.target.value)}
            value={input.demoUrl}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface/80 p-4">
          <TextField
            helperText={textos.admin.form.helpers.technologies}
            label={textos.admin.form.fields.technologies}
            onChange={(event) => setTechnologyDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addTechnology();
              }
            }}
            value={technologyDraft}
          />
          <div className="flex flex-wrap gap-2">
            {input.technologies.map((technology) => (
              <Chip
                key={technology}
                label={technology}
                onDelete={() =>
                  update(
                    'technologies',
                    input.technologies.filter((item) => item !== technology),
                  )
                }
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface/80 p-4">
          <div>
            <p className="font-bold text-text">{textos.admin.form.fields.images}</p>
            <p className="text-sm text-text-muted">{textos.admin.form.helpers.images}</p>
          </div>
          <Button
            leftIcon={<AddPhotoAlternateIcon aria-hidden="true" />}
            onClick={() => document.getElementById('study-project-images')?.click()}
            type="button"
            variant="secondary"
          >
            {textos.common.open}
          </Button>
          <input
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            id="study-project-images"
            multiple
            onChange={(event) => addImages(event.target.files)}
            type="file"
          />
          {errors.images ? (
            <p className="text-sm font-semibold text-error">{errors.images}</p>
          ) : null}
          <div className="grid gap-4 md:grid-cols-3">
            {images.map((image, index) => (
              <div
                className="rounded-[var(--radius-lg)] border border-border bg-surface-secondary p-3"
                key={image.id}
              >
                <div className="relative aspect-video overflow-hidden rounded-[var(--radius-md)]">
                  <Image
                    alt={image.alt || input.title || textos.admin.form.preview}
                    className="object-cover"
                    fill
                    src={image.previewUrl}
                  />
                </div>
                {index === 0 ? (
                  <Tag className="mt-3" variant="primary">
                    {textos.admin.form.cover}
                  </Tag>
                ) : null}
                <TextField
                  className="mt-3"
                  label={textos.admin.form.fields.imageAlt}
                  onChange={(event) =>
                    setImages((current) =>
                      current.map((item) =>
                        item.id === image.id
                          ? { ...item, alt: event.target.value }
                          : item,
                      ),
                    )
                  }
                  size="small"
                  value={image.alt}
                />
                <div className="mt-3 flex gap-2">
                  <IconButton
                    disabled={index === 0}
                    label={textos.admin.form.actions.moveImageLeft}
                    onClick={() => moveImage(index, -1)}
                    size="small"
                    variant="ghost"
                  >
                    <ArrowBackIcon aria-hidden="true" fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    disabled={index === images.length - 1}
                    label={textos.admin.form.actions.moveImageRight}
                    onClick={() => moveImage(index, 1)}
                    size="small"
                    variant="ghost"
                  >
                    <ArrowForwardIcon aria-hidden="true" fontSize="inherit" />
                  </IconButton>
                  <IconButton
                    label={textos.admin.form.actions.removeImage}
                    onClick={() => removeImage(image.id)}
                    size="small"
                    variant="ghost"
                  >
                    <DeleteOutlineIcon aria-hidden="true" fontSize="inherit" />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        <FormControlLabel
          control={
            <Checkbox
              checked={input.portfolioEligible}
              onChange={(event) => update('portfolioEligible', event.target.checked)}
            />
          }
          label={textos.admin.form.fields.portfolioEligible}
        />

        <Button
          disabled={loading}
          leftIcon={<SendIcon aria-hidden="true" />}
          loading={loading}
          type="submit"
        >
          {loading
            ? textos.admin.form.actions.publishing
            : textos.admin.form.actions.publish}
        </Button>
      </div>

      <aside className="h-fit rounded-[var(--radius-xl)] border border-border bg-surface/80 p-5 shadow-[var(--shadow-card)]">
        <p className="mb-4 text-sm font-bold uppercase text-text-muted">
          {textos.admin.form.preview}
        </p>
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border">
          <div className="relative aspect-video bg-surface-secondary">
            {images[0] ? (
              <Image
                alt={images[0].alt || input.title || textos.admin.form.preview}
                className="object-cover"
                fill
                src={images[0].previewUrl}
              />
            ) : null}
          </div>
          <div className="space-y-3 p-4">
            <h3 className="text-xl font-black text-text">
              {input.title || textos.admin.form.fields.projectTitle}
            </h3>
            <p className="text-sm leading-6 text-text-muted">
              {input.description || textos.admin.form.fields.projectDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {input.technologies.map((technology) => (
                <Tag key={technology}>{technology}</Tag>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {dirty ? (
        <span
          aria-hidden="true"
          data-confirm-leave={textos.admin.form.actions.confirmLeave}
        />
      ) : null}
    </form>
  );
}
