'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import GoogleIcon from '@mui/icons-material/Google';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Alert, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useAuth } from '@/components/auth';
import { useLanguage } from '@/components/language';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { IconButton } from '@/components/ui/IconButton';
import { Tag } from '@/components/ui/Tag';
import {
  createDocumentation,
  deleteDocumentation,
  getAllDocumentations,
  toDocumentationInput,
  updateDocumentation,
} from '@/services/firebase/studyDocumentationService';
import {
  STUDY_DOCUMENTATION_AUTHOR,
  type StudyDocumentation,
  type StudyDocumentationInput,
} from '@/types/firebase/studyDocumentation';
import { MarkdownRenderer } from './MarkdownRenderer';

const ADMIN_EMAIL = 'sergioevandocosta@gmail.com';
const SUGGESTED_TAGS = [
  'IA & LLMs',
  'Desenvolvimento',
  'Arquitetura',
  'Carreira',
  'Boas práticas',
  'Eficiência',
  'TypeScript',
  'React',
  'CI/CD',
  'DevOps',
  'RAG',
  'Outros',
];

interface DocumentationFormErrors {
  title?: string;
  tags?: string;
  content?: string;
  auth?: string;
}

function createEmptyForm(): StudyDocumentationInput {
  return {
    title: '',
    tags: [],
    content: '',
  };
}

function isAdminUser(user: ReturnType<typeof useAuth>['user']) {
  return Boolean(user) && user?.email === ADMIN_EMAIL && user.emailVerified === true;
}

function normalizeTag(tag: string) {
  return tag.trim();
}

function mapServiceError(error: unknown, textos: ReturnType<typeof useLanguage>['textos']) {
  if (!(error instanceof Error)) {
    return textos.studyDocumentations.admin.errors.save;
  }

  if (error.message === 'documentation-title-required') {
    return textos.studyDocumentations.admin.errors.titleRequired;
  }

  if (error.message === 'documentation-content-required') {
    return textos.studyDocumentations.admin.errors.contentRequired;
  }

  if (error.message === 'documentation-tags-required') {
    return textos.studyDocumentations.admin.errors.tagsRequired;
  }

  if (
    error.message === 'documentation-token-required' ||
    error.message === 'documentation-unauthorized'
  ) {
    return textos.studyDocumentations.admin.errors.unauthorized;
  }

  return textos.studyDocumentations.admin.errors.save;
}

export function StudyDocumentationsAdminPage() {
  const params = useSearchParams();
  const { textos } = useLanguage();
  const { user, loading, isAuthenticated, authError, signInWithGoogle, signOut } =
    useAuth();
  const [documentations, setDocumentations] = useState<StudyDocumentation[]>([]);
  const [form, setForm] = useState<StudyDocumentationInput>(() => createEmptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<DocumentationFormErrors>({});
  const [loadingList, setLoadingList] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudyDocumentation | null>(null);
  const [dirty, setDirty] = useState(false);
  const adminAllowed = isAdminUser(user);

  const sortedDocumentations = useMemo(
    () =>
      [...documentations].sort((left, right) => right.updatedAt - left.updatedAt),
    [documentations],
  );

  const loadDocumentations = useCallback(async () => {
    setLoadingList(true);
    setLoadError(false);

    try {
      const items = await getAllDocumentations();
      setDocumentations(items);
    } catch {
      setLoadError(true);
    } finally {
      setLoadingList(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setForm(createEmptyForm());
    setEditingId(null);
    setTagInput('');
    setErrors({});
    setDirty(false);
  }, []);

  const startEdit = useCallback((documentation: StudyDocumentation) => {
    setForm(toDocumentationInput(documentation));
    setEditingId(documentation.id);
    setErrors({});
    setStatus(null);
    setDirty(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (!adminAllowed) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void loadDocumentations();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [adminAllowed, loadDocumentations]);

  useEffect(() => {
    const idFromUrl = params.get('id');

    if (!idFromUrl || documentations.length === 0) {
      return;
    }

    const documentation = documentations.find((item) => item.id === idFromUrl);

    if (!documentation) {
      return;
    }

    const timeout = window.setTimeout(() => {
      startEdit(documentation);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [documentations, params, startEdit]);

  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = textos.studyDocumentations.admin.unsavedChanges;
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty, textos.studyDocumentations.admin.unsavedChanges]);

  const updateForm = <Key extends keyof StudyDocumentationInput>(
    key: Key,
    value: StudyDocumentationInput[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
    setStatus(null);
  };

  const addTag = (tag = tagInput) => {
    const normalized = normalizeTag(tag);

    if (!normalized || form.tags.includes(normalized)) {
      return;
    }

    updateForm('tags', [...form.tags, normalized]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    updateForm(
      'tags',
      form.tags.filter((item) => item !== tag),
    );
  };

  const validateForm = () => {
    const nextErrors: DocumentationFormErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = textos.studyDocumentations.admin.errors.titleRequired;
    }

    if (!form.content.trim()) {
      nextErrors.content = textos.studyDocumentations.admin.errors.contentRequired;
    }

    if (form.tags.map(normalizeTag).filter(Boolean).length === 0) {
      nextErrors.tags = textos.studyDocumentations.admin.errors.tagsRequired;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveDocumentation = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) {
      setErrors({ auth: textos.studyDocumentations.admin.errors.auth });
      return;
    }

    setSaving(true);
    setStatus(null);

    try {
      const token = await user.getIdToken(true);

      if (editingId) {
        await updateDocumentation(editingId, form, token);
      } else {
        await createDocumentation(form, token);
      }

      await loadDocumentations();
      resetForm();
      setStatus(textos.studyDocumentations.admin.success);
    } catch (error) {
      setStatus(mapServiceError(error, textos));
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
      await deleteDocumentation(deleteTarget.id, token);
      await loadDocumentations();
      setDeleteTarget(null);
      setStatus(textos.studyDocumentations.admin.deleteSuccess);

      if (editingId === deleteTarget.id) {
        resetForm();
      }
    } catch {
      setStatus(textos.studyDocumentations.admin.errors.delete);
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    resetForm();
    await signOut();
  };

  if (loading) {
    return (
      <Container className="py-16">
        <p className="text-text-muted">{textos.studyDocumentations.admin.loadingAuth}</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-16">
        <div className="max-w-xl rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-3xl font-black text-text">
            {textos.studyDocumentations.admin.loginTitle}
          </h1>
          <p className="mt-3 text-text-muted">
            {textos.studyDocumentations.admin.loginDescription}
          </p>
          <Button
            className="mt-6"
            leftIcon={<GoogleIcon aria-hidden="true" />}
            onClick={signInWithGoogle}
          >
            {textos.studyDocumentations.admin.signIn}
          </Button>
          {authError ? (
            <Alert className="mt-4" severity="error">
              {authError}
            </Alert>
          ) : null}
        </div>
      </Container>
    );
  }

  if (!adminAllowed) {
    return (
      <Container className="py-16">
        <div className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-3xl font-black text-text">
            {textos.admin.accessDeniedTitle}
          </h1>
          <p className="mt-3 text-text-muted">
            {textos.studyDocumentations.admin.deniedDescription}
          </p>
          <Button
            className="mt-6"
            leftIcon={<LogoutIcon aria-hidden="true" />}
            onClick={logout}
            variant="secondary"
          >
            {textos.studyDocumentations.admin.signOut}
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-8 py-12">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-black text-text">
            {textos.studyDocumentations.admin.title}
          </h1>
          <p className="mt-3 text-text-muted">
            {textos.studyDocumentations.admin.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button leftIcon={<AddIcon aria-hidden="true" />} onClick={resetForm}>
            {textos.studyDocumentations.admin.newDocumentation}
          </Button>
          <Button
            leftIcon={<LogoutIcon aria-hidden="true" />}
            onClick={logout}
            variant="secondary"
          >
            {textos.studyDocumentations.admin.signOut}
          </Button>
        </div>
      </div>

      {status ? (
        <Alert
          severity={
            status === textos.studyDocumentations.admin.success ||
            status === textos.studyDocumentations.admin.deleteSuccess
              ? 'success'
              : 'error'
          }
        >
          {status}
        </Alert>
      ) : null}
      {errors.auth ? <Alert severity="error">{errors.auth}</Alert> : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form
          className="grid gap-4 rounded-[var(--radius-xl)] border border-border bg-surface/80 p-5 shadow-[var(--shadow-card)] [&_.MuiFormHelperText-root]:font-semibold [&_.MuiFormHelperText-root]:text-error [&_.MuiInputBase-input::placeholder]:!text-text dark:[&_.MuiInputBase-input::placeholder]:!text-primary [&_.MuiInputBase-input::placeholder]:!opacity-100 [&_.MuiInputBase-input]:!text-text [&_.MuiInputBase-root]:bg-surface-secondary [&_.MuiInputBase-root]:text-text [&_.MuiInputBase-root.Mui-focused_.MuiOutlinedInput-notchedOutline]:border-primary [&_.MuiInputLabel-root]:!font-bold [&_.MuiInputLabel-root]:!text-text dark:[&_.MuiInputLabel-root]:!text-primary [&_.MuiInputLabel-root.Mui-focused]:!text-primary [&_.MuiOutlinedInput-notchedOutline]:border-border"
          onSubmit={(event) => {
            event.preventDefault();
            void saveDocumentation();
          }}
        >
          <h2 className="text-2xl font-black text-text">
            {editingId
              ? textos.studyDocumentations.admin.edit
              : textos.studyDocumentations.admin.newDocumentation}
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[var(--radius-md)] border border-border bg-surface-secondary p-3">
              <p className="text-xs font-semibold uppercase text-text-muted">
                {textos.studyDocumentations.admin.readonlyId}
              </p>
              <p className="mt-1 break-all text-sm font-bold text-text">
                {editingId ?? '-'}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border bg-surface-secondary p-3">
              <p className="text-xs font-semibold uppercase text-text-muted">
                {textos.studyDocumentations.admin.readonlyAuthor}
              </p>
              <p className="mt-1 text-sm font-bold text-text">
                {STUDY_DOCUMENTATION_AUTHOR}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border bg-surface-secondary p-3">
              <p className="text-xs font-semibold uppercase text-text-muted">
                {textos.studyDocumentations.admin.readonlyUpdatedAt}
              </p>
              <p className="mt-1 text-sm font-bold text-text">server timestamp</p>
            </div>
          </div>

          <TextField
            error={Boolean(errors.title)}
            helperText={errors.title}
            label={textos.studyDocumentations.admin.titleField}
            onChange={(event) => updateForm('title', event.target.value)}
            value={form.title}
          />

          <div className="grid gap-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <TextField
                error={Boolean(errors.tags)}
                helperText={errors.tags}
                label={textos.studyDocumentations.admin.tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addTag();
                  }
                }}
                value={tagInput}
              />
              <Button onClick={() => addTag()} type="button" variant="secondary">
                {textos.studyDocumentations.admin.addTag}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag) => (
                <button
                  aria-label={textos.studyDocumentations.admin.removeTag(tag)}
                  className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  key={tag}
                  onClick={() => removeTag(tag)}
                  type="button"
                >
                  <Tag>{tag}</Tag>
                </button>
              ))}
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-text">
                {textos.studyDocumentations.admin.suggestedTags}
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map((tag) => (
                  <button
                    className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                    key={tag}
                    onClick={() => addTag(tag)}
                    type="button"
                  >
                    <Tag variant="primary">{tag}</Tag>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <TextField
            error={Boolean(errors.content)}
            helperText={errors.content}
            label={textos.studyDocumentations.admin.contentField}
            minRows={14}
            multiline
            onChange={(event) => updateForm('content', event.target.value)}
            value={form.content}
          />

          <div className="rounded-[var(--radius-lg)] border border-border bg-surface-secondary p-4">
            <h3 className="mb-4 text-lg font-black text-text">
              {textos.studyDocumentations.admin.preview}
            </h3>
            {form.content.trim() ? (
              <MarkdownRenderer markdown={form.content} />
            ) : (
              <p className="text-text-muted">
                {textos.studyDocumentations.admin.contentField}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button loading={saving} type="submit">
              {saving
                ? textos.studyDocumentations.admin.saving
                : textos.studyDocumentations.admin.save}
            </Button>
            {editingId ? (
              <Button onClick={resetForm} type="button" variant="secondary">
                {textos.studyDocumentations.admin.cancelEdit}
              </Button>
            ) : null}
          </div>
        </form>

        <aside className="rounded-[var(--radius-xl)] border border-border bg-surface/80 p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-text">
              {textos.studyDocumentations.title}
            </h2>
            <IconButton
              label={textos.studyDocumentations.retry}
              onClick={() => void loadDocumentations()}
              size="small"
              variant="ghost"
            >
              <RefreshIcon aria-hidden="true" fontSize="inherit" />
            </IconButton>
          </div>

          {loadingList ? (
            <p className="text-text-muted">
              {textos.studyDocumentations.admin.loadingList}
            </p>
          ) : null}
          {loadError ? (
            <Alert severity="error">{textos.studyDocumentations.admin.errors.load}</Alert>
          ) : null}
          {!loadingList && sortedDocumentations.length === 0 ? (
            <p className="text-text-muted">{textos.studyDocumentations.empty}</p>
          ) : null}

          <div className="grid gap-3">
            {sortedDocumentations.map((documentation) => (
              <article
                className="rounded-[var(--radius-md)] border border-border bg-surface-secondary p-4"
                key={documentation.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-text">
                      {documentation.title || documentation.id}
                    </h3>
                    <p className="text-sm text-text-muted">{documentation.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <IconButton
                      label={textos.studyDocumentations.admin.edit}
                      onClick={() => startEdit(documentation)}
                      size="small"
                      variant="ghost"
                    >
                      <EditOutlinedIcon aria-hidden="true" fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      label={textos.studyDocumentations.admin.delete}
                      onClick={() => setDeleteTarget(documentation)}
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
        <DialogTitle>{textos.studyDocumentations.admin.confirmDelete}</DialogTitle>
        <DialogContent>
          {deleteTarget
            ? textos.studyDocumentations.admin.confirmDeleteMessage(deleteTarget.title)
            : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} variant="secondary">
            {textos.common.close}
          </Button>
          <Button loading={saving} onClick={() => void confirmDelete()}>
            {textos.studyDocumentations.admin.confirmDelete}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
