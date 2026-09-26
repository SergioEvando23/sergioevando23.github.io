'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
} from '@mui/material';
import { useAuth } from '@/components/auth';
import { useLanguage } from '@/components/language';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { IconButton } from '@/components/ui/IconButton';
import { Tag } from '@/components/ui/Tag';
import {
  createStudy,
  deleteStudy,
  getStudy,
  listStudies,
  updateStudy,
} from '@/services/firebase/firebaseStudyRestService';
import type { StudyPayload } from '@/services/firebase/studyRestTypes';
import {
  type SelectedStudyImage,
  uploadStudyImagesToGithub,
} from '@/services/github/githubImageService';
import {
  emptyStudyPayload,
  hasStudyErrors,
  slugifyStudyId,
  STUDY_CATEGORIES,
  STUDY_KINDS,
  validateStudyPayload,
  type StudyFormErrors,
} from '@/services/study/studyValidation';
import { createProjectPreview } from '@/services/study/projectPreview';
import type { StudyProject } from '@/types/firebase/studyProject';

const ADMIN_EMAIL = 'sergioevandocosta@gmail.com';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

function createDraftStudyId() {
  const timestamp = Date.now().toString(36);
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);

  return `study-${timestamp}-${random}`;
}

function createEmptyStudyForm() {
  return {
    ...emptyStudyPayload(),
    id: createDraftStudyId(),
  };
}

function projectToPayload(project: StudyProject): StudyPayload {
  return {
    id: project.id,
    repository: project.repository,
    title: project.title,
    description: project.description,
    focus: project.focus,
    technologies: project.technologies,
    category: project.category,
    kind: project.kind,
    startedAt: project.startedAt,
    completedAt: project.completedAt,
    date: project.date,
    githubUrl: project.githubUrl,
    portfolioEligible: project.portfolioEligible,
    demoUrl: project.demoUrl ?? '',
    preview: createProjectPreview(project.demoUrl, project.preview),
    coverImage: project.coverImage,
    images: project.images ?? [],
  };
}

function isAdminUser(user: ReturnType<typeof useAuth>['user']) {
  return (
    Boolean(user) &&
    user?.email === ADMIN_EMAIL &&
    user.emailVerified === true
  );
}

export function StudyAdminPage() {
  const { textos } = useLanguage();
  const { user, loading, isAuthenticated, authError, signInWithGoogle, signOut } =
    useAuth();
  const [studies, setStudies] = useState<StudyProject[]>([]);
  const [form, setForm] = useState<StudyPayload>(() => createEmptyStudyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<StudyFormErrors>({});
  const [technology, setTechnology] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [selectedImages, setSelectedImages] = useState<SelectedStudyImage[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loadingStudies, setLoadingStudies] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<StudyProject | null>(null);
  const [dirty, setDirty] = useState(false);

  const adminAllowed = isAdminUser(user);
  const sortedStudies = useMemo(
    () =>
      [...studies].sort((left, right) =>
        (right.completedAt || right.date).localeCompare(left.completedAt || left.date),
      ),
    [studies],
  );

  const loadStudies = useCallback(async () => {
    setLoadingStudies(true);
    setLoadError(false);

    try {
      setStudies(await listStudies());
    } catch {
      setLoadError(true);
    } finally {
      setLoadingStudies(false);
    }
  }, []);

  useEffect(() => {
    if (adminAllowed) {
      const timeout = window.setTimeout(() => {
        void loadStudies();
      }, 0);

      return () => window.clearTimeout(timeout);
    }

    return undefined;
  }, [adminAllowed, loadStudies]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) {
        return;
      }

      event.preventDefault();
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  useEffect(
    () => () => {
      selectedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    },
    [selectedImages],
  );

  const updateField = <Key extends keyof StudyPayload>(
    key: Key,
    value: StudyPayload[Key],
  ) => {
    setForm((current) => {
      const nextValue = key === 'id' && !editingId ? slugifyStudyId(String(value)) : value;
      return key === 'demoUrl'
        ? {
            ...current,
            demoUrl: nextValue as string,
            preview: createProjectPreview(nextValue as string, current.preview),
          }
        : { ...current, [key]: nextValue };
    });
    setDirty(true);
    setStatus(null);
  };

  const resetForm = () => {
    selectedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
    setSelectedImages([]);
    setForm(createEmptyStudyForm());
    setEditingId(null);
    setErrors({});
    setTechnology('');
    setDirty(false);
  };

  const startEdit = (project: StudyProject) => {
    resetForm();
    setForm(projectToPayload(project));
    setEditingId(project.id);
    setDirty(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addTechnology = () => {
    const normalized = technology.trim();

    if (!normalized || form.technologies.includes(normalized)) {
      return;
    }

    updateField('technologies', [...form.technologies, normalized]);
    setTechnology('');
  };

  const removeTechnology = (item: string) => {
    updateField(
      'technologies',
      form.technologies.filter((technologyItem) => technologyItem !== item),
    );
  };

  const handleImages = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const nextErrors: StudyFormErrors = {};
    const newImages = Array.from(files)
      .filter((file) => {
        if (!IMAGE_TYPES.includes(file.type)) {
          nextErrors.images = textos.studyAdmin.errors.imageType;
          return false;
        }

        if (file.size > MAX_IMAGE_SIZE) {
          nextErrors.images = textos.studyAdmin.errors.imageSize;
          return false;
        }

        return true;
      })
      .map((file, index) => ({
        id: `${file.name}-${file.lastModified}-${index}`,
        file,
        previewUrl: URL.createObjectURL(file),
        isCover: selectedImages.length === 0 && index === 0,
      }));

    setErrors((current) => ({ ...current, ...nextErrors }));
    setSelectedImages((current) => [...current, ...newImages].slice(0, 6));
    setDirty(true);
  };

  const setCover = (id: string) => {
    setSelectedImages((current) =>
      current.map((image) => ({ ...image, isCover: image.id === id })),
    );
    setDirty(true);
  };

  const removeImage = (id: string) => {
    setSelectedImages((current) => {
      const removed = current.find((image) => image.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      const remaining = current.filter((image) => image.id !== id);
      return remaining.map((image, index) => ({
        ...image,
        isCover: image.isCover || index === 0,
      }));
    });
    setDirty(true);
  };

  const saveStudy = async () => {
    const validation = validateStudyPayload(form);
    setErrors(validation);

    if (hasStudyErrors(validation)) {
      return;
    }

    if (!user) {
      setErrors({ githubToken: textos.studyAdmin.errors.auth });
      return;
    }

    if (selectedImages.length > 0 && !githubToken.trim()) {
      setErrors({ githubToken: textos.studyAdmin.errors.githubToken });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      if (!editingId) {
        const existing = await getStudy(form.id);

        if (existing) {
          setErrors({ id: textos.studyAdmin.errors.duplicate });
          return;
        }
      }

      let imagePaths = form.images ?? [];
      let coverImage = form.coverImage ?? '';

      if (selectedImages.length > 0) {
        const uploaded = await uploadStudyImagesToGithub(
          form.id,
          selectedImages,
          githubToken.trim(),
        );
        imagePaths = uploaded.map((image) => image.publicPath);
        coverImage = imagePaths[0] ?? '';
      }

      const token = await user.getIdToken(true);
      const payload = {
        ...form,
        images: imagePaths,
        coverImage,
        preview: createProjectPreview(form.demoUrl, form.preview),
      };

      if (editingId) {
        await updateStudy(payload, token);
      } else {
        await createStudy(payload, token);
      }

      await loadStudies();
      resetForm();
      setStatus(textos.studyAdmin.success);
    } catch {
      setStatus(
        selectedImages.length > 0
          ? textos.studyAdmin.uploadPartial
          : textos.studyAdmin.errors.save,
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !user) {
      return;
    }

    setSaving(true);

    try {
      const token = await user.getIdToken(true);
      await deleteStudy(deleteTarget.id, token);
      await loadStudies();
      setDeleteTarget(null);
      setStatus(textos.studyAdmin.deleteSuccess);
    } catch {
      setStatus(textos.studyAdmin.errors.delete);
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    setGithubToken('');
    resetForm();
    await signOut();
  };

  if (loading) {
    return (
      <Container className="py-16">
        <p className="text-text-muted">{textos.studyAdmin.loadingAuth}</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-16">
        <div className="max-w-xl rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-3xl font-black text-text">{textos.studyAdmin.loginTitle}</h1>
          <p className="mt-3 text-text-muted">{textos.studyAdmin.loginDescription}</p>
          <Button
            className="mt-6"
            leftIcon={<GoogleIcon aria-hidden="true" />}
            onClick={signInWithGoogle}
          >
            {textos.studyAdmin.signIn}
          </Button>
          {authError ? <Alert className="mt-4" severity="error">{authError}</Alert> : null}
        </div>
      </Container>
    );
  }

  if (!adminAllowed) {
    return (
      <Container className="py-16">
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8">
          <h1 className="text-3xl font-black text-text">{textos.admin.accessDeniedTitle}</h1>
          <p className="mt-3 text-text-muted">{textos.studyAdmin.deniedDescription}</p>
          <Button
            className="mt-6"
            leftIcon={<LogoutIcon aria-hidden="true" />}
            onClick={logout}
            variant="secondary"
          >
            {textos.studyAdmin.signOut}
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-8 py-12">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-black text-text">{textos.studyAdmin.title}</h1>
          <p className="mt-3 text-text-muted">{textos.studyAdmin.description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button leftIcon={<AddIcon aria-hidden="true" />} onClick={resetForm}>
            {textos.studyAdmin.newStudy}
          </Button>
          <Button
            leftIcon={<LogoutIcon aria-hidden="true" />}
            onClick={logout}
            variant="secondary"
          >
            {textos.studyAdmin.signOut}
          </Button>
        </div>
      </div>

      {status ? <Alert severity={status.includes('sucesso') || status.includes('success') ? 'success' : 'warning'}>{status}</Alert> : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form
          className="grid gap-4 rounded-[var(--radius-xl)] border border-border bg-surface/80 p-5 shadow-[var(--shadow-card)] [&_.MuiFormHelperText-root]:font-semibold [&_.MuiFormHelperText-root]:text-error [&_.MuiInputBase-input::placeholder]:!text-text dark:[&_.MuiInputBase-input::placeholder]:!text-primary [&_.MuiInputBase-input::placeholder]:!opacity-100 [&_.MuiInputBase-input]:!text-text [&_.MuiInputBase-root]:bg-surface-secondary [&_.MuiInputBase-root]:text-text [&_.MuiInputBase-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-primary [&_.MuiInputLabel-root]:!font-bold [&_.MuiInputLabel-root]:!text-text dark:[&_.MuiInputLabel-root]:!text-primary [&_.MuiInputLabel-root.Mui-focused]:!text-primary [&_.MuiOutlinedInput-notchedOutline]:border-border [&_.MuiSelect-icon]:!text-text dark:[&_.MuiSelect-icon]:!text-primary"
          onSubmit={(event) => {
            event.preventDefault();
            void saveStudy();
          }}
        >
          <h2 className="text-2xl font-black text-text">
            {editingId ? textos.studyAdmin.editStudy : textos.studyAdmin.newStudy}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              disabled={Boolean(editingId)}
              error={Boolean(errors.id)}
              helperText={errors.id}
              label={textos.studyAdmin.fields.id}
              onChange={(event) => updateField('id', event.target.value)}
              value={form.id}
            />
            <TextField
              error={Boolean(errors.repository)}
              helperText={errors.repository}
              label={textos.studyAdmin.fields.repository}
              onChange={(event) => updateField('repository', event.target.value)}
              value={form.repository}
            />
            <TextField
              error={Boolean(errors.title)}
              helperText={errors.title}
              label={textos.studyAdmin.fields.title}
              onChange={(event) => updateField('title', event.target.value)}
              value={form.title}
            />
            <TextField
              error={Boolean(errors.focus)}
              helperText={errors.focus}
              label={textos.studyAdmin.fields.focus}
              onChange={(event) => updateField('focus', event.target.value)}
              value={form.focus}
            />
            <TextField
              label={textos.studyAdmin.fields.category}
              onChange={(event) => updateField('category', event.target.value)}
              select
              value={form.category}
            >
              {STUDY_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={textos.studyAdmin.fields.kind}
              onChange={(event) => updateField('kind', event.target.value)}
              select
              value={form.kind}
            >
              {STUDY_KINDS.map((kind) => (
                <MenuItem key={kind} value={kind}>
                  {kind}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label={textos.studyAdmin.fields.startedAt}
              onChange={(event) => updateField('startedAt', event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
              value={form.startedAt}
            />
            <TextField
              label={textos.studyAdmin.fields.completedAt}
              onChange={(event) => updateField('completedAt', event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
              value={form.completedAt}
            />
            <TextField
              error={Boolean(errors.date)}
              helperText={errors.date}
              label={textos.studyAdmin.fields.date}
              onChange={(event) => updateField('date', event.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              type="date"
              value={form.date}
            />
            <TextField
              error={Boolean(errors.githubUrl)}
              helperText={errors.githubUrl}
              label={textos.studyAdmin.fields.githubUrl}
              onChange={(event) => updateField('githubUrl', event.target.value)}
              value={form.githubUrl}
            />
            <TextField
              error={Boolean(errors.demoUrl)}
              helperText={errors.demoUrl ?? textos.studyAdmin.fields.demoUrlHelp}
              label={textos.studyAdmin.fields.demoUrl}
              onChange={(event) => updateField('demoUrl', event.target.value)}
              value={form.demoUrl}
            />
          </div>

          <TextField
            error={Boolean(errors.description)}
            helperText={errors.description}
            label={textos.studyAdmin.fields.description}
            minRows={4}
            multiline
            onChange={(event) => updateField('description', event.target.value)}
            value={form.description}
          />

          <div className="grid gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <TextField
                error={Boolean(errors.technologies)}
                helperText={errors.technologies}
                label={textos.studyAdmin.fields.addTechnology}
                onChange={(event) => setTechnology(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addTechnology();
                  }
                }}
                value={technology}
              />
              <Button onClick={addTechnology} variant="secondary">
                {textos.studyAdmin.actions.addTechnology}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.technologies.map((item) => (
                <button
                  aria-label={textos.studyAdmin.actions.removeTechnology(item)}
                  className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  key={item}
                  onClick={() => removeTechnology(item)}
                  type="button"
                >
                  <Tag>{item}</Tag>
                </button>
              ))}
            </div>
          </div>

          <FormControlLabel
            control={
              <Checkbox
                checked={form.portfolioEligible}
                onChange={(event) =>
                  updateField('portfolioEligible', event.target.checked)
                }
              />
            }
            label={textos.studyAdmin.fields.portfolioEligible}
          />

          <TextField
            helperText={textos.studyAdmin.githubTokenHelp}
            label={textos.studyAdmin.githubTokenLabel}
            onChange={(event) => setGithubToken(event.target.value)}
            type="password"
            value={githubToken}
          />
          {errors.githubToken ? <Alert severity="error">{errors.githubToken}</Alert> : null}

          <div className="grid gap-3">
            <label className="text-sm font-bold text-text" htmlFor="study-images">
              {textos.studyAdmin.fields.images}
            </label>
            <input
              accept="image/png,image/jpeg,image/webp"
              className="cursor-pointer text-sm text-text-muted file:mr-4 file:rounded-[var(--radius-md)] file:border-0 file:bg-[var(--color-primary)] file:px-4 file:py-2 file:font-semibold file:text-[var(--color-primary-foreground)] file:shadow-[var(--shadow-glow)] file:transition-colors hover:file:bg-[var(--color-primary-hover)]"
              id="study-images"
              multiple
              onChange={(event) => handleImages(event.target.files)}
              type="file"
            />
            {errors.images ? <Alert severity="error">{errors.images}</Alert> : null}
            <div className="grid gap-3 md:grid-cols-3">
              {selectedImages.map((image) => (
                <div
                  className="rounded-[var(--radius-md)] border border-border bg-surface-secondary p-3"
                  key={image.id}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={image.file.name}
                    className="aspect-video w-full rounded-[var(--radius-sm)] object-cover"
                    src={image.previewUrl}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      onClick={() => setCover(image.id)}
                      size="small"
                      variant={image.isCover ? 'primary' : 'secondary'}
                    >
                      {textos.studyAdmin.actions.setCover}
                    </Button>
                    <Button
                      onClick={() => removeImage(image.id)}
                      size="small"
                      variant="ghost"
                    >
                      {textos.studyAdmin.actions.removeImage}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button loading={saving} type="submit">
              {saving ? textos.studyAdmin.saving : textos.studyAdmin.saveStudy}
            </Button>
            {editingId ? (
              <Button onClick={resetForm} type="button" variant="secondary">
                {textos.studyAdmin.cancelEdit}
              </Button>
            ) : null}
          </div>
        </form>

        <aside className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-text">{textos.studyGallery.title}</h2>
            <IconButton
              label={textos.studyAdmin.actions.retry}
              onClick={() => void loadStudies()}
              size="small"
              variant="ghost"
            >
              <RefreshIcon aria-hidden="true" fontSize="inherit" />
            </IconButton>
          </div>

          {loadingStudies ? <p className="text-text-muted">{textos.studyAdmin.loadingStudies}</p> : null}
          {loadError ? <Alert severity="error">{textos.studyAdmin.errors.load}</Alert> : null}
          {!loadingStudies && sortedStudies.length === 0 ? (
            <p className="text-text-muted">{textos.studyAdmin.empty}</p>
          ) : null}

          <div className="grid gap-3">
            {sortedStudies.map((study) => (
              <article
                className="rounded-[var(--radius-md)] border border-border bg-surface-secondary p-4"
                key={study.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-text">{study.title || study.id}</h3>
                    <p className="text-sm text-text-muted">{study.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <IconButton
                      label={textos.studyAdmin.editStudy}
                      onClick={() => startEdit(study)}
                      size="small"
                      variant="ghost"
                    >
                      <EditOutlinedIcon aria-hidden="true" fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      label={textos.studyAdmin.deleteStudy}
                      onClick={() => setDeleteTarget(study)}
                      size="small"
                      variant="ghost"
                    >
                      <DeleteOutlineIcon aria-hidden="true" fontSize="inherit" />
                    </IconButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </section>

      <Dialog onClose={() => setDeleteTarget(null)} open={Boolean(deleteTarget)}>
        <DialogTitle>{textos.studyAdmin.confirmDelete}</DialogTitle>
        <DialogContent>
          {deleteTarget
            ? textos.studyAdmin.confirmDeleteMessage(
                deleteTarget.title || deleteTarget.id,
                deleteTarget.id,
              )
            : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} variant="secondary">
            {textos.common.close}
          </Button>
          <Button loading={saving} onClick={() => void confirmDelete()}>
            {textos.studyAdmin.confirmDelete}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
