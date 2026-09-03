// ===============================================================
//  PROJECT CATEGORIES
// ===============================================================
//  Categories are now managed from the Admin Dashboard
//  (/admin/categories) and stored in the same backend as projects
//  (Firestore or localStorage). See src/categories/categoriesStore.js
//
//  The list below is only the DEFAULT SEED — it is written to the
//  backend once, the first time the collection is empty. After that,
//  add / rename / reorder / delete categories from the dashboard.
//
//  A category is { id, label, order }.
//    id    -> stored on each project ( project.category === category.id )
//            immutable after creation (renaming the label is fine)
//    label -> what the visitor sees
//    order -> sort position in the filter + form
// ===============================================================

export const DEFAULT_CATEGORIES = [
  { id: 'web', label: 'Web Development', order: 1 },
  { id: 'mobile', label: 'Mobile', order: 2 },
  { id: 'uiux', label: 'UI/UX', order: 3 },
  { id: 'backend', label: 'Backend', order: 4 },
  { id: 'other', label: 'Other', order: 5 },
];

// Back-compat alias (some modules import this name).
export const PROJECT_CATEGORIES = DEFAULT_CATEGORIES;

// Sentinel used by the filter UI for "no filter".
export const ALL_CATEGORY = { id: '__all__', label: 'All Projects' };

// Fallback id used when a project's category is missing / was deleted.
export const FALLBACK_CATEGORY_ID = 'other';

/** Turn a label into a safe, unique category id. */
export function slugifyCategory(label, existingIds = []) {
  let base = String(label || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!base) base = `cat-${Math.random().toString(36).slice(2, 7)}`;
  let id = base;
  let n = 2;
  while (existingIds.includes(id)) id = `${base}-${n++}`;
  return id;
}

/**
 * Human label for a category id.
 * Pass the live category list; falls back to the default seed, then to
 * a prettified version of the id so unknown ids never show up blank.
 */
export function categoryLabel(id, categories = DEFAULT_CATEGORIES) {
  if (id === ALL_CATEGORY.id) return ALL_CATEGORY.label;
  const list = Array.isArray(categories) && categories.length ? categories : DEFAULT_CATEGORIES;
  const found = list.find((c) => c.id === id) || DEFAULT_CATEGORIES.find((c) => c.id === id);
  if (found) return found.label;
  if (!id) return 'Other';
  return String(id).replace(/[-_]+/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}
