// ===============================================================
//  ADMIN · PROJECTS TABLE  (list · search · filter · CRUD)
// ===============================================================
import { useEffect, useMemo, useState } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import { useProjects } from '../../projects/useProjects';
import { useCategories } from '../../categories/useCategories';
import {
  createProject,
  updateProject,
  deleteProject,
  seedIfEmpty,
  projectsBackend,
} from '../../projects/projectsStore';
import { ALL_CATEGORY, categoryLabel } from '../../config/projectCategories';
import ProjectFormModal from './ProjectFormModal';
import ConfirmDialog from './ConfirmDialog';
import './admin.css';

export default function AdminProjects() {
  const { projects, loading, error } = useProjects();
  const { categories } = useCategories();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(ALL_CATEGORY.id);
  const [form, setForm] = useState(null); // { mode, project? }
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [toast, setToast] = useState('');

  const permissionDenied =
    error && (error.code === 'permission-denied' || /permission/i.test(error.message || ''));

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (categoryFilter !== ALL_CATEGORY.id && p.category !== categoryFilter)
        return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technologies.join(' ').toLowerCase().includes(q)
      );
    });
  }, [projects, search, categoryFilter]);

  const handleCreate = async (values) => {
    await createProject(values);
    setToast('Project added');
  };

  const handleUpdate = async (values) => {
    await updateProject(form.project.id, values);
    setToast('Changes saved');
  };

  const handleImport = async () => {
    setSeeding(true);
    try {
      const n = await seedIfEmpty();
      setToast(n > 0 ? `Imported ${n} projects` : 'Nothing to import');
    } catch (err) {
      setToast(
        err?.code === 'permission-denied'
          ? 'Blocked by Firestore rules — publish them first'
          : 'Import failed',
      );
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(deleteTarget.id);
      setToast('Project deleted');
      setDeleteTarget(null);
    } catch {
      setToast('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section>
      <div className="admin-toolbar">
        <div className="admin-search">
          <RiSearchLine />
          <input
            className="admin-input"
            type="search"
            placeholder="Search projects…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-toolbar__filter">
          <select
            className="admin-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option value={ALL_CATEGORY.id}>All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn--primary"
          onClick={() => setForm({ mode: 'create' })}
        >
          + Add project
        </button>

        {!loading && (
          <span className="admin-count">
            {filtered.length} of {projects.length} shown
          </span>
        )}
      </div>

      {error && (
        <div className="admin-login__error">
          Could not load projects: {error.message || 'unknown error'}
          {permissionDenied && projectsBackend === 'firebase' && (
            <div style={{ marginTop: '0.5rem', fontWeight: 400 }}>
              Firestore is rejecting requests. In the Firebase console open{' '}
              <strong>Firestore Database → Rules</strong>, paste the contents of{' '}
              <code>firestore.rules</code> from the project, and click{' '}
              <strong>Publish</strong>. Then reload this page.
            </div>
          )}
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 84 }}>Image</th>
              <th>Title</th>
              <th style={{ width: 150 }}>Category</th>
              <th style={{ width: 90 }}>Featured</th>
              <th style={{ width: 150, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="admin-empty">
                  Loading projects…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="admin-empty">
                    <h3>
                      {projects.length === 0
                        ? 'No projects yet'
                        : 'No projects match your filters'}
                    </h3>
                    <p>
                      {projects.length === 0
                        ? 'Add your first project to see it on the portfolio.'
                        : 'Try a different search or category.'}
                    </p>
                    {projects.length === 0 && !error && (
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm"
                        style={{ marginTop: '0.75rem' }}
                        onClick={handleImport}
                        disabled={seeding}
                      >
                        {seeding ? 'Importing…' : 'Import my 3 existing projects'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td data-label="Image">
                    {p.image ? (
                      <img
                        className="admin-thumb"
                        src={p.image}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.visibility = 'hidden';
                        }}
                      />
                    ) : (
                      <span className="admin-thumb admin-thumb--empty">—</span>
                    )}
                  </td>
                  <td data-label="Title">
                    <span className="admin-cell-title">
                      {p.title}
                      <small>{p.technologies.slice(0, 4).join(' · ')}</small>
                    </span>
                  </td>
                  <td data-label="Category">
                    <span className="admin-badge">
                      {categoryLabel(p.category, categories)}
                    </span>
                  </td>
                  <td data-label="Featured">
                    <span
                      className={`admin-badge ${p.featured ? 'admin-badge--yes' : ''}`}
                    >
                      {p.featured ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm"
                        onClick={() => setForm({ mode: 'edit', project: p })}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm admin-btn--danger"
                        onClick={() => setDeleteTarget(p)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {form?.mode === 'create' && (
        <ProjectFormModal
          mode="create"
          categories={categories}
          onSubmit={handleCreate}
          onClose={() => setForm(null)}
        />
      )}

      {form?.mode === 'edit' && (
        <ProjectFormModal
          mode="edit"
          initialValues={form.project}
          categories={categories}
          onSubmit={handleUpdate}
          onClose={() => setForm(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this project?"
          message={
            <>
              <strong>{deleteTarget.title}</strong> will be permanently removed
              from your portfolio. This cannot be undone.
            </>
          }
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => !deleting && setDeleteTarget(null)}
        />
      )}

      {toast && <div className="admin-toast">{toast}</div>}
    </section>
  );
}
