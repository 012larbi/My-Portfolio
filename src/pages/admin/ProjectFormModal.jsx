// ===============================================================
//  ADD / EDIT PROJECT  — shared modal form with validation
// ===============================================================
import { useEffect, useMemo, useRef, useState } from 'react';
import { DEFAULT_CATEGORIES } from '../../config/projectCategories';
import { KNOWN_TECHNOLOGIES } from '../../config/technologies';
import ImageField from './ImageField';

const EMPTY = {
  title: '',
  description: '',
  image: '',
  category: '',
  technologies: [],
  githubUrl: '',
  liveUrl: '',
  featured: false,
};

function isValidUrl(value, { allowRelative = false } = {}) {
  if (!value) return false;
  if (allowRelative && (value.startsWith('/') || value.startsWith('data:image/'))) {
    return true;
  }
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function validate(values) {
  const errors = {};
  if (!values.title.trim()) errors.title = 'Title is required.';
  else if (values.title.trim().length < 2) errors.title = 'Title is too short.';

  if (!values.description.trim()) errors.description = 'Description is required.';
  else if (values.description.trim().length < 10)
    errors.description = 'Please add a few more words (min 10 characters).';

  if (!values.image.trim()) errors.image = 'An image is required.';
  else if (!isValidUrl(values.image.trim(), { allowRelative: true }))
    errors.image = 'Enter a valid image URL (https://…), a /path, or a data URI.';

  if (!values.category) errors.category = 'Choose a category.';

  if (values.githubUrl.trim() && !isValidUrl(values.githubUrl.trim()))
    errors.githubUrl = 'Enter a valid URL (https://…).';

  if (values.liveUrl.trim() && !isValidUrl(values.liveUrl.trim()))
    errors.liveUrl = 'Enter a valid URL (https://…).';

  return errors;
}

export default function ProjectFormModal({
  mode = 'create',
  initialValues,
  categories = DEFAULT_CATEGORIES,
  onSubmit,
  onClose,
}) {
  const catList = categories && categories.length ? categories : DEFAULT_CATEGORIES;
  const [values, setValues] = useState(() => ({ ...EMPTY, ...(initialValues || {}) }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [techDraft, setTechDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const firstFieldRef = useRef(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [submitting, onClose]);

  const liveErrors = useMemo(() => validate(values), [values]);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));
  const blur = (name) => setTouched((t) => ({ ...t, [name]: true }));
  const showError = (name) => (touched[name] || errors[name]) && liveErrors[name];

  const addTech = (raw) => {
    const t = raw.trim().replace(/,$/, '').trim();
    if (!t) return;
    if (!values.technologies.some((x) => x.toLowerCase() === t.toLowerCase())) {
      set('technologies', [...values.technologies, t]);
    }
    setTechDraft('');
  };

  const removeTech = (name) =>
    set('technologies', values.technologies.filter((x) => x !== name));

  const onTechKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTech(techDraft);
    } else if (e.key === 'Backspace' && !techDraft && values.technologies.length) {
      removeTech(values.technologies[values.technologies.length - 1]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    setTouched({
      title: true,
      description: true,
      image: true,
      category: true,
      githubUrl: true,
      liveUrl: true,
    });
    if (Object.keys(found).length) return;

    setSubmitting(true);
    setFormError('');
    try {
      const payload = {
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        image: values.image.trim(),
        githubUrl: values.githubUrl.trim(),
        liveUrl: values.liveUrl.trim(),
        technologies: [
          ...values.technologies,
          ...(techDraft.trim() ? [techDraft.trim()] : []),
        ],
      };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setFormError(
        err?.message
          ? `Could not save: ${err.message}`
          : 'Could not save. Please try again.',
      );
      setSubmitting(false);
    }
  };

  return (
    <div
      className="admin-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <form
        className="admin-modal"
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        noValidate
      >
        <div className="admin-modal__head">
          <h2>{mode === 'edit' ? 'Edit project' : 'Add project'}</h2>
          <button
            type="button"
            className="admin-modal__close"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
          >
            ×
          </button>
        </div>

        {formError && <div className="admin-login__error">{formError}</div>}

        <div className="admin-field">
          <label className="admin-label" htmlFor="pf-title">
            Project title <span>*</span>
          </label>
          <input
            id="pf-title"
            ref={firstFieldRef}
            className={`admin-input ${showError('title') ? 'admin-input--invalid' : ''}`}
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
            onBlur={() => blur('title')}
            placeholder="e.g. SportPro Ecommerce"
          />
          {showError('title') && <p className="admin-error">{liveErrors.title}</p>}
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="pf-desc">
            Description <span>*</span>
          </label>
          <textarea
            id="pf-desc"
            className={`admin-textarea ${showError('description') ? 'admin-textarea--invalid' : ''}`}
            value={values.description}
            onChange={(e) => set('description', e.target.value)}
            onBlur={() => blur('description')}
            placeholder="What the project does, in one or two sentences."
          />
          {showError('description') && (
            <p className="admin-error">{liveErrors.description}</p>
          )}
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="pf-image">
            Image <span>*</span>
          </label>
          <ImageField
            id="pf-image"
            folder="projects"
            value={values.image}
            invalid={!!showError('image')}
            onChange={(v) => {
              set('image', v);
              setTouched((t) => ({ ...t, image: true }));
            }}
            onBlur={() => blur('image')}
          />
          {showError('image') && (
            <p className="admin-error">{liveErrors.image}</p>
          )}
        </div>

        <div className="admin-row-2">
          <div className="admin-field">
            <label className="admin-label" htmlFor="pf-category">
              Category <span>*</span>
            </label>
            <select
              id="pf-category"
              className={`admin-select ${showError('category') ? 'admin-select--invalid' : ''}`}
              value={values.category}
              onChange={(e) => set('category', e.target.value)}
              onBlur={() => blur('category')}
            >
              <option value="">Select…</option>
              {catList.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            {showError('category') && (
              <p className="admin-error">{liveErrors.category}</p>
            )}
          </div>

          <div className="admin-field">
            <label className="admin-label">Featured</label>
            <label className="admin-check" style={{ marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                checked={values.featured}
                onChange={(e) => set('featured', e.target.checked)}
              />
              Show this project first
            </label>
          </div>
        </div>

        <div className="admin-field">
          <label className="admin-label" htmlFor="pf-tech">
            Technologies
          </label>
          <input
            id="pf-tech"
            className="admin-input"
            value={techDraft}
            onChange={(e) => setTechDraft(e.target.value)}
            onKeyDown={onTechKeyDown}
            onBlur={() => addTech(techDraft)}
            list="pf-tech-list"
            placeholder="Type a tech and press Enter (e.g. React)"
          />
          <datalist id="pf-tech-list">
            {KNOWN_TECHNOLOGIES.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          {values.technologies.length > 0 && (
            <div className="admin-tags">
              {values.technologies.map((t) => (
                <span className="admin-tag" key={t}>
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTech(t)}
                    aria-label={`Remove ${t}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="admin-row-2">
          <div className="admin-field">
            <label className="admin-label" htmlFor="pf-github">
              GitHub URL
            </label>
            <input
              id="pf-github"
              className={`admin-input ${showError('githubUrl') ? 'admin-input--invalid' : ''}`}
              value={values.githubUrl}
              onChange={(e) => set('githubUrl', e.target.value)}
              onBlur={() => blur('githubUrl')}
              placeholder="https://github.com/…"
            />
            {showError('githubUrl') && (
              <p className="admin-error">{liveErrors.githubUrl}</p>
            )}
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="pf-live">
              Live demo URL
            </label>
            <input
              id="pf-live"
              className={`admin-input ${showError('liveUrl') ? 'admin-input--invalid' : ''}`}
              value={values.liveUrl}
              onChange={(e) => set('liveUrl', e.target.value)}
              onBlur={() => blur('liveUrl')}
              placeholder="https://…"
            />
            {showError('liveUrl') && (
              <p className="admin-error">{liveErrors.liveUrl}</p>
            )}
          </div>
        </div>

        <div className="admin-modal__foot">
          <button
            type="button"
            className="admin-btn admin-btn--ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            disabled={submitting}
          >
            {submitting
              ? 'Saving…'
              : mode === 'edit'
                ? 'Save changes'
                : 'Add project'}
          </button>
        </div>
      </form>
    </div>
  );
}
