// ===============================================================
//  CATEGORIES STORE  —  single data access layer for categories
// ===============================================================
//  Public API:
//     subscribeCategories(onChange, onError) -> unsubscribe()
//     listCategories()                        -> Promise<Category[]>
//     createCategory({ label })               -> Promise<Category>
//     updateCategory(id, { label, order })    -> Promise<void>
//     deleteCategory(id)                      -> Promise<void>
//     seedIfEmpty()                           -> Promise<number>
//
//  Backend chosen automatically (same rule as projectsStore):
//     Firebase Firestore  when VITE_FIREBASE_* is set, else localStorage.
//
//  Category shape: { id, label, order, createdAt }
//  `id` is generated from the label on creation and never changes.
// ===============================================================

import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

import { isFirebaseConfigured, db, auth } from '../lib/firebase';
import { DEFAULT_CATEGORIES, slugifyCategory } from '../config/projectCategories';

const STORAGE_KEY = 'portfolio.categories.v1';
const COLLECTION = 'categories';

// ---------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------

export function normaliseCategory(raw = {}) {
  return {
    id: raw.id != null ? String(raw.id) : '',
    label: (raw.label || '').trim(),
    order: Number.isFinite(raw.order) ? raw.order : 999,
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

export function sortCategories(list) {
  return [...list].sort(
    (a, b) => a.order - b.order || a.label.localeCompare(b.label),
  );
}

const seedDocs = () =>
  DEFAULT_CATEGORIES.map((c, i) => ({
    ...normaliseCategory(c),
    createdAt: new Date(Date.now() + i).toISOString(),
  }));

// ===============================================================
//  FIRESTORE
// ===============================================================

function firestoreStore() {
  let seedPromise = null;

  async function seedIfEmpty() {
    const snap = await getDocs(collection(db, COLLECTION));
    if (!snap.empty) return 0;
    if (!auth || !auth.currentUser) return 0;
    const batch = writeBatch(db);
    seedDocs().forEach((c) => {
      const { id, ...body } = c;
      batch.set(doc(db, COLLECTION, id), body);
    });
    await batch.commit();
    return DEFAULT_CATEGORIES.length;
  }

  function ensureSeeded() {
    if (!seedPromise) {
      seedPromise = seedIfEmpty().catch((err) => {
        seedPromise = null;
        throw err;
      });
    }
    return seedPromise;
  }

  return {
    seedIfEmpty,

    subscribeCategories(onChange, onError) {
      let unsub = () => {};
      let cancelled = false;
      ensureSeeded()
        .catch(() => {})
        .then(() => {
          if (cancelled) return;
          unsub = onSnapshot(
            query(collection(db, COLLECTION), orderBy('order', 'asc')),
            (snap) => {
              const items = snap.docs.map((d) =>
                normaliseCategory({ id: d.id, ...d.data() }),
              );
              onChange(sortCategories(items));
            },
            (err) => onError && onError(err),
          );
        });
      return () => {
        cancelled = true;
        unsub();
      };
    },

    async listCategories() {
      await ensureSeeded().catch(() => {});
      const snap = await getDocs(collection(db, COLLECTION));
      return sortCategories(
        snap.docs.map((d) => normaliseCategory({ id: d.id, ...d.data() })),
      );
    },

    async createCategory({ label, order }) {
      const existing = await getDocs(collection(db, COLLECTION));
      const ids = existing.docs.map((d) => d.id);
      const maxOrder = existing.docs.reduce(
        (m, d) => Math.max(m, Number(d.data().order) || 0),
        0,
      );
      const id = slugifyCategory(label, ids);
      const body = {
        label: String(label).trim(),
        order: Number.isFinite(order) ? order : maxOrder + 1,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, COLLECTION, id), body);
      return normaliseCategory({ id, ...body });
    },

    async updateCategory(id, data) {
      const body = {};
      if (data.label != null) body.label = String(data.label).trim();
      if (Number.isFinite(data.order)) body.order = data.order;
      await updateDoc(doc(db, COLLECTION, id), body);
    },

    async deleteCategory(id) {
      await deleteDoc(doc(db, COLLECTION, id));
    },
  };
}

// ===============================================================
//  LOCAL STORAGE
// ===============================================================

function localStore() {
  const listeners = new Set();

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).map(normaliseCategory);
    } catch {
      /* ignore */
    }
    const seeded = seedDocs();
    write(seeded);
    return seeded;
  }

  function write(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }

  function emit() {
    const data = sortCategories(read());
    listeners.forEach((cb) => cb(data));
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) emit();
    });
  }

  return {
    async seedIfEmpty() {
      return 0;
    },

    subscribeCategories(onChange) {
      listeners.add(onChange);
      onChange(sortCategories(read()));
      return () => listeners.delete(onChange);
    },

    async listCategories() {
      return sortCategories(read());
    },

    async createCategory({ label, order }) {
      const list = read();
      const id = slugifyCategory(
        label,
        list.map((c) => c.id),
      );
      const maxOrder = list.reduce((m, c) => Math.max(m, c.order || 0), 0);
      const cat = normaliseCategory({
        id,
        label,
        order: Number.isFinite(order) ? order : maxOrder + 1,
        createdAt: new Date().toISOString(),
      });
      write([...list, cat]);
      emit();
      return cat;
    },

    async updateCategory(id, data) {
      const next = read().map((c) =>
        c.id === id
          ? normaliseCategory({
              ...c,
              ...('label' in data ? { label: data.label } : {}),
              ...(Number.isFinite(data.order) ? { order: data.order } : {}),
              id,
              createdAt: c.createdAt,
            })
          : c,
      );
      write(next);
      emit();
    },

    async deleteCategory(id) {
      write(read().filter((c) => c.id !== id));
      emit();
    },
  };
}

// ===============================================================
//  EXPORT
// ===============================================================

const store = isFirebaseConfigured ? firestoreStore() : localStore();

export const categoriesBackend = isFirebaseConfigured ? 'firebase' : 'local';

export const subscribeCategories = (...a) => store.subscribeCategories(...a);
export const listCategories = (...a) => store.listCategories(...a);
export const createCategory = (...a) => store.createCategory(...a);
export const updateCategory = (...a) => store.updateCategory(...a);
export const deleteCategory = (...a) => store.deleteCategory(...a);
export const seedCategoriesIfEmpty = (...a) => store.seedIfEmpty(...a);
