// ===============================================================
//  ADMIN · CATEGORIES  (list · add · rename · reorder · delete)
// ===============================================================
import { useEffect, useMemo, useState } from 'react';
import { RiArrowUpSLine, RiArrowDownSLine } from 'react-icons/ri';
import { useProjects } from '../../projects/useProjects';
import { useCategories } from '../../categories/useCategories';
import { updateProject } from '../../projects/projectsStore';
import {
  createCategory,
  updateCategory,
  deleteCategory,
  seedCategoriesIfEmpty,
  categoriesBackend,
} from '../../categories/categoriesStore';
import { FALLBACK_CATEGORY_ID } from '../../config/projectCategories';
import ConfirmDialog from './ConfirmDialog';
import './admin.css';

export default function AdminCategories() {
  const { categories, loading, error } = useCategories();
  const { projects } = useProjects();

  const [newLabel, setNewLabel] = useState('');
  const [addError, setAddError] = useState('');
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editError, setEditError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const permissionDenied =
    error &&
    (error.code === 'permission-denied' ||
      /permission/i.test(error.message || ''));

  const countByCat = useMemo(() => {
    const m = {};
    projects.forEach((p) => {
      m[p.category] = (m[p.category] || 0) + 1;
    });
    return m;
  }, [projects]);

  const duplicate = (label, exceptId) =>
    categories.some(
      (c) =>
        c.id !== exceptId &&
        c.label.trim().toLowerCase() === label.trim().toLowerCase(),
    );

  // ---- add -------------------------------------------------------
  const handleAdd = async (e) => {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return setAddError('Enter a category name.');
    if (duplicate(label)) return setAddError('That category already exists.');
    setAdding(true);
    setAddError('');
    try {
      await createCategory({ label });
      setNewLabel('');
      setToast('Category added');
    } catch (err) {
      setAddError(
        err?.code === 'permission-denied'
          ? 'Blocked by Firestore rules — publish them first.'
          : 'Could not add category.',
      );
    } finally {
      setAdding(false);
    }
  };

  // ---- rename ---------------------------------------------------
  const startEdit = (c) => {
    setEditingId(c.id);
    setEditLabel(c.label);
    setEditError('');
  };
  const saveEdit = async () => {
    const label = editLabel.trim();
    if (!label) return setEditError('Name cannot be empty.');
    if (duplicate(label, editingId))
      return setEditError('That category already exists.');
    setBusyId(editingId);
    try {
      await updateCategory(editingId, { label });
      setEditingId(null);
      setToast('Category renamed');
    } catch {
      setEditError('Could not save.');
    } finally {
      setBusyId(null);
    }
  };

  // ---- reorder ------------------------------------------------
  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= categories.length) return;
    const a = categories[index];
    const b = categories[target];
    setBusyId(a.id);
    try {
      await Promise.all([
        updateCategory(a.id, { order: b.order }),
        updateCategory(b.id, { order: a.order }),
      ]);
    } catch {
      setToast('Could not reorder');
    } finally {
      setBusyId(null);
    }
  };

  // ---- delete -------------------------------------------------
  const handleDelete = async () => {
    const id = deleteTarget.id;
    setDeleting(true);
    try {
      const affected = projects.filter((p) => p.category === id);
      const fallbackExists =
        id !== FALLBACK_CATEGORY_ID &&
        categories.some((c) => c.id === FALLBACK_CATEGORY_ID);
      if (fallbackExists && affected.length) {
        await Promise.all(
          affected.map((p) =>
            updateProject(p.id, { category: FALLBACK_CATEGORY_ID }),
          ),
        );
      }
      await deleteCategory(id);
      setToast('Category deleted');
      setDeleteTarget(null);
    } catch (err) {
      setToast(
        err?.code === 'permission-denied' ? 'Blocked by Firestore rules' : 'Delete failed',
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleImport = async () => {
    setSeeding(true);
    try {
      const n = await seedCategoriesIfEmpty();
      setToast(n > 0 ? `Imported ${n} categories` : 'Nothing to import');
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

  return (
    <section>
      <form className="admin-toolbar" onSubmit={handleAdd}>
        <div className="admin-search" style={{ flex: '1 1 240px' }}>
          <input
            className="admin-input"
            style={{ paddingLeft: '0.85rem' }}
            placeholder="New category name (e.g. DevOps)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={adding}
        >
          {adding ? 'Adding…' : '+ Add category'}
        </button>
        {!loading && (
          <span className="admin-count">{categories.length} categories</span>
        )}
      </form>
      {addError && (
        <div className="admin-login__error" style={{ marginBottom: '1rem' }}>
          {addError}
        </div>
      )}

      {error && (
        <div className="admin-login__error">
          Could not load categories: {error.message || 'unknown error'}
          {permissionDenied && categoriesBackend === 'firebase' && (
            <div style={{ marginTop: '0.5rem', fontWeight: 400 }}>
              Open <strong>Firestore Database → Rules</strong> in the Firebase
              console, paste <code>firestore.rules</code>, click{' '}
              <strong>Publish</strong>, then reload.
            </div>
          )}
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 90 }}>Order</th>
              <th>Name</th>
              <th style={{ width: 160 }}>Slug (id)</th>
              <th style={{ width: 90 }}>Projects</th>
              <th style={{ width: 170, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="admin-empty">
                  Loading categories…
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="admin-empty">
                    <h3>No categories</h3>
                    <p>Import the defaults or add one above.</p>
                    {!error && (
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm"
                        style={{ marginTop: '0.75rem' }}
                        onClick={handleImport}
                        disabled={seeding}
                      >
                        {seeding ? 'Importing…' : 'Import default categories'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((c, i) => (
                <tr key={c.id}>
                  <td data-label="Order">
                    <div className="admin-row-actions" style={{ justifyContent: 'flex-start' }}>
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm"
                        aria-label="Move up"
                        disabled={i === 0 || busyId === c.id}
                        onClick={() => move(i, -1)}
                      >
                        <RiArrowUpSLine />
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--sm"
                        aria-label="Move down"
                        disabled={i === categories.length - 1 || busyId === c.id}
                        onClick={() => move(i, 1)}
                      >
                        <RiArrowDownSLine />
                      </button>
                    </div>
                  </td>
                  <td data-label="Name">
                    {editingId === c.id ? (
                      <div>
                        <input
                          className="admin-input"
                          value={editLabel}
                          autoFocus
                          onChange={(e) => setEditLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit();
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                        />
                        {editError && <p className="admin-error">{editError}</p>}
                      </div>
                    ) : (
                      <span className="admin-cell-title">{c.label}</span>
                    )}
                  </td>
                  <td data-label="Slug">
                    <span className="admin-badge">{c.id}</span>
                  </td>
                  <td data-label="Projects">{countByCat[c.id] || 0}</td>
                  <td data-label="Actions">
                    <div className="admin-row-actions">
                      {editingId === c.id ? (
                        <>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm admin-btn--primary"
                            onClick={saveEdit}
                            disabled={busyId === c.id}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm"
                            onClick={() => startEdit(c)}
                          >
                            Rename
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--sm admin-btn--danger"
                            onClick={() => setDeleteTarget(c)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title="Delete this category?"
          message={
            <>
              <strong>{deleteTarget.label}</strong> will be removed.
              {(() => {
                const n = countByCat[deleteTarget.id] || 0;
                if (!n) return ' No projects use it.';
                const toOther =
                  deleteTarget.id !== FALLBACK_CATEGORY_ID &&
                  categories.some((c) => c.id === FALLBACK_CATEGORY_ID);
                return ` ${n} project${n > 1 ? 's' : ''} ${
                  n > 1 ? 'use' : 'uses'
                } it and will be ${
                  toOther ? 'moved to “Other”' : 'left uncategorised'
                }.`;
              })()}
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
