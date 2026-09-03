// ===============================================================
//  ADMIN · ABOUT PAGE CONTENT EDITOR
// ===============================================================
import { useEffect, useMemo, useState } from 'react';
import { RiArrowUpSLine, RiArrowDownSLine, RiDeleteBin6Line } from 'react-icons/ri';
import { useAboutContent } from '../../content/useAboutContent';
import { saveAbout, seedAboutIfEmpty, aboutBackend } from '../../content/aboutStore';
import {
  SKILL_CATEGORY_OPTIONS,
  RESUME_CATEGORY_OPTIONS,
  RESUME_ICON_OPTIONS,
} from '../../content/aboutDefaults';
import ImageField from './ImageField';
import './admin.css';

const TEMPLATES = {
  personalInfo: { title: '', description: '', link: '' },
  stats: { no: '', title: '' },
  skills: { title: '', level: '', category: 'Frontend', icon: '' },
  resume: {
    category: 'experience',
    iconName: 'graduation',
    year: '',
    title: '',
    desc: '',
  },
};

// Module-level so inputs inside it keep focus between keystrokes.
function RowShell({ idx, count, onMove, onRemove, children }) {
  return (
    <div className="admin-about__row">
      <div className="admin-about__row-fields">{children}</div>
      <div className="admin-about__row-actions">
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          aria-label="Move up"
          disabled={idx === 0}
          onClick={() => onMove(-1)}
        >
          <RiArrowUpSLine />
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          aria-label="Move down"
          disabled={idx === count - 1}
          onClick={() => onMove(1)}
        >
          <RiArrowDownSLine />
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--sm admin-btn--danger"
          aria-label="Remove"
          onClick={onRemove}
        >
          <RiDeleteBin6Line />
        </button>
      </div>
    </div>
  );
}

export default function AdminAbout() {
  const { about, loading, error } = useAboutContent();
  const [draft, setDraft] = useState(about);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [toast, setToast] = useState('');

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(about),
    [draft, about],
  );

  // keep the draft in sync with incoming data while there are no local edits
  useEffect(() => {
    if (!dirty) setDraft(about);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [about]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const permissionDenied =
    error &&
    (error.code === 'permission-denied' ||
      /permission/i.test(error.message || ''));

  const patch = (section, idx, key, value) =>
    setDraft((d) => ({
      ...d,
      [section]: d[section].map((r, i) => (i === idx ? { ...r, [key]: value } : r)),
    }));

  const addRow = (section) =>
    setDraft((d) => ({
      ...d,
      [section]: [
        ...d[section],
        { ...TEMPLATES[section], id: `n_${Date.now()}` },
      ],
    }));

  const removeRow = (section, idx) =>
    setDraft((d) => ({
      ...d,
      [section]: d[section].filter((_, i) => i !== idx),
    }));

  const move = (section, idx, dir) =>
    setDraft((d) => {
      const a = [...d[section]];
      const j = idx + dir;
      if (j < 0 || j >= a.length) return d;
      [a[idx], a[j]] = [a[j], a[idx]];
      return { ...d, [section]: a };
    });

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveAbout(draft);
      setToast('About page saved');
    } catch (err) {
      setToast(
        err?.code === 'permission-denied'
          ? 'Blocked by Firestore rules — publish them first'
          : 'Save failed',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleImport = async () => {
    setSeeding(true);
    try {
      const n = await seedAboutIfEmpty();
      setToast(n > 0 ? 'Default content imported' : 'Nothing to import');
    } catch {
      setToast('Import failed');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div className="admin-empty">Loading About content…</div>;
  }

  return (
    <section className="admin-about">
      {error && (
        <div className="admin-login__error">
          Could not load content: {error.message || 'unknown error'}
          {permissionDenied && aboutBackend === 'firebase' && (
            <div style={{ marginTop: '0.5rem', fontWeight: 400 }}>
              Publish <code>firestore.rules</code> (it now includes a{' '}
              <code>content</code> rule) in the Firebase console, then reload.
            </div>
          )}
        </div>
      )}

      {/* ---------- Personal information ---------- */}
      <div className="admin-about__section">
        <h3>Personal information</h3>
        <div className="admin-about__rows">
          {draft.personalInfo.map((r, i) => (
            <RowShell
              key={i}
              idx={i}
              count={draft.personalInfo.length}
              onMove={(dir) => move('personalInfo', i, dir)}
              onRemove={() => removeRow('personalInfo', i)}
            >
              <label className="admin-about__f">
                <span>Label</span>
                <input
                  className="admin-input"
                  value={r.title}
                  onChange={(e) => patch('personalInfo', i, 'title', e.target.value)}
                  placeholder="First Name : "
                />
              </label>
              <label className="admin-about__f">
                <span>Value</span>
                <input
                  className="admin-input"
                  value={r.description}
                  onChange={(e) =>
                    patch('personalInfo', i, 'description', e.target.value)
                  }
                  placeholder="Larbi"
                />
              </label>
              <label className="admin-about__f">
                <span>Link (optional)</span>
                <input
                  className="admin-input"
                  value={r.link}
                  onChange={(e) => patch('personalInfo', i, 'link', e.target.value)}
                  placeholder="https://linkedin.com/in/…"
                />
              </label>
            </RowShell>
          ))}
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => addRow('personalInfo')}
        >
          + Add row
        </button>
      </div>

      {/* ---------- Stats ---------- */}
      <div className="admin-about__section">
        <h3>Stats</h3>
        <div className="admin-about__rows">
          {draft.stats.map((r, i) => (
            <RowShell
              key={i}
              idx={i}
              count={draft.stats.length}
              onMove={(dir) => move('stats', i, dir)}
              onRemove={() => removeRow('stats', i)}
            >
              <label className="admin-about__f admin-about__f--sm">
                <span>Number</span>
                <input
                  className="admin-input"
                  value={r.no}
                  onChange={(e) => patch('stats', i, 'no', e.target.value)}
                  placeholder="10+"
                />
              </label>
              <label className="admin-about__f">
                <span>Label ( &lt;br /&gt; allowed )</span>
                <input
                  className="admin-input"
                  value={r.title}
                  onChange={(e) => patch('stats', i, 'title', e.target.value)}
                  placeholder="Completed <br /> Projects"
                />
              </label>
            </RowShell>
          ))}
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => addRow('stats')}
        >
          + Add row
        </button>
      </div>

      {/* ---------- Skills ---------- */}
      <div className="admin-about__section">
        <h3>Skills</h3>
        <div className="admin-about__rows">
          {draft.skills.map((r, i) => (
            <RowShell
              key={i}
              idx={i}
              count={draft.skills.length}
              onMove={(dir) => move('skills', i, dir)}
              onRemove={() => removeRow('skills', i)}
            >
              <label className="admin-about__f">
                <span>Name</span>
                <input
                  className="admin-input"
                  value={r.title}
                  onChange={(e) => patch('skills', i, 'title', e.target.value)}
                  placeholder="React"
                />
              </label>
              <label className="admin-about__f admin-about__f--sm">
                <span>Level</span>
                <input
                  className="admin-input"
                  value={r.level}
                  onChange={(e) => patch('skills', i, 'level', e.target.value)}
                  placeholder="Advanced"
                />
              </label>
              <label className="admin-about__f admin-about__f--sm">
                <span>Group</span>
                <select
                  className="admin-select"
                  value={r.category}
                  onChange={(e) => patch('skills', i, 'category', e.target.value)}
                >
                  {SKILL_CATEGORY_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-about__f admin-about__f--wide">
                <span>Icon — a technology name (react, html…) or an uploaded image</span>
                <ImageField
                  iconMode
                  compact
                  folder="skills"
                  value={r.icon}
                  onChange={(v) => patch('skills', i, 'icon', v)}
                />
              </label>
            </RowShell>
          ))}
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => addRow('skills')}
        >
          + Add row
        </button>
      </div>

      {/* ---------- Experience & Education ---------- */}
      <div className="admin-about__section">
        <h3>Experience &amp; Education</h3>
        <div className="admin-about__rows">
          {draft.resume.map((r, i) => (
            <RowShell
              key={i}
              idx={i}
              count={draft.resume.length}
              onMove={(dir) => move('resume', i, dir)}
              onRemove={() => removeRow('resume', i)}
            >
              <label className="admin-about__f admin-about__f--sm">
                <span>Column</span>
                <select
                  className="admin-select"
                  value={r.category}
                  onChange={(e) => patch('resume', i, 'category', e.target.value)}
                >
                  {RESUME_CATEGORY_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-about__f admin-about__f--sm">
                <span>Icon</span>
                <select
                  className="admin-select"
                  value={r.iconName}
                  onChange={(e) => patch('resume', i, 'iconName', e.target.value)}
                >
                  {RESUME_ICON_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
              <label className="admin-about__f admin-about__f--sm">
                <span>Year</span>
                <input
                  className="admin-input"
                  value={r.year}
                  onChange={(e) => patch('resume', i, 'year', e.target.value)}
                  placeholder="2023 - 2026"
                />
              </label>
              <label className="admin-about__f admin-about__f--wide">
                <span>Title ( &lt;span&gt; allowed )</span>
                <input
                  className="admin-input"
                  value={r.title}
                  onChange={(e) => patch('resume', i, 'title', e.target.value)}
                  placeholder="Software Engineering <span> EMSI - Casablanca </span>"
                />
              </label>
              <label className="admin-about__f admin-about__f--wide">
                <span>Description</span>
                <textarea
                  className="admin-textarea"
                  value={r.desc}
                  onChange={(e) => patch('resume', i, 'desc', e.target.value)}
                  rows={2}
                />
              </label>
            </RowShell>
          ))}
        </div>
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={() => addRow('resume')}
        >
          + Add row
        </button>
      </div>

      <div className="admin-about__bar">
        <button
          type="button"
          className="admin-btn admin-btn--sm"
          onClick={handleImport}
          disabled={seeding}
          title="Re-writes the default content into the backend if it is empty"
        >
          {seeding ? 'Importing…' : 'Import defaults'}
        </button>
        <span style={{ flex: 1 }} />
        <button
          type="button"
          className="admin-btn"
          onClick={() => setDraft(about)}
          disabled={!dirty || saving}
        >
          Discard
        </button>
        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={handleSave}
          disabled={!dirty || saving}
        >
          {saving ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
        </button>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </section>
  );
}
