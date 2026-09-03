// ===============================================================
//  PROJECTS STORE  —  single data access layer for projects
// ===============================================================
//  Public API (all async where it touches storage):
//     subscribeProjects(onChange, onError) -> unsubscribe()
//     listProjects()                        -> Promise<Project[]>
//     createProject(data)                   -> Promise<Project>
//     updateProject(id, data)               -> Promise<void>
//     deleteProject(id)                     -> Promise<void>
//
//  Backend is chosen automatically:
//     - Firebase Firestore    when VITE_FIREBASE_* env vars are set
//     - browser localStorage  otherwise (zero-config fallback)
//
//  Existing projects (src/data/seedProjects.js) are imported once
//  into whichever backend is active, so they never disappear.
// ===============================================================

import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';

import { isFirebaseConfigured, db, auth } from '../lib/firebase';
import { SEED_PROJECTS } from '../data/seedProjects';
import { FALLBACK_CATEGORY_ID } from '../config/projectCategories';

const STORAGE_KEY = 'portfolio.projects.v1';
const COLLECTION = 'projects';

// ---------------------------------------------------------------
//  Shared helpers
// ---------------------------------------------------------------

/** Force a raw record into the full, predictable project shape. */
export function normaliseProject(raw = {}) {
  return {
    id: raw.id != null ? String(raw.id) : '',
    title: (raw.title || '').trim(),
    description: (raw.description || '').trim(),
    image: (raw.image || '').trim(),
    // keep whatever category id was chosen (may be a custom one created
    // in the dashboard); only fall back when it is empty.
    category: (raw.category ? String(raw.category).trim() : '') || FALLBACK_CATEGORY_ID,
    technologies: Array.isArray(raw.technologies)
      ? raw.technologies.map((t) => String(t).trim()).filter(Boolean)
      : typeof raw.technologies === 'string'
        ? raw.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    githubUrl: (raw.githubUrl || '').trim(),
    liveUrl: (raw.liveUrl || '').trim(),
    featured: Boolean(raw.featured),
    createdAt: raw.createdAt || new Date().toISOString(),
  };
}

/** Featured first, then newest first. Used everywhere for consistency. */
export function sortProjects(list) {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return String(b.createdAt).localeCompare(String(a.createdAt));
  });
}

/** Strip fields that must never be written into a document body. */
function toDoc(data) {
  const p = normaliseProject(data);
  delete p.id;
  return p;
}

// ===============================================================
//  FIRESTORE IMPLEMENTATION
// ===============================================================

function firestoreStore() {
  let seedPromise = null;

  // Write the migrated projects into an empty collection.
  // The recommended security rules only allow writes to a signed-in
  // user, so this is a no-op until an admin is authenticated (it then
  // runs automatically the first time the dashboard loads). Returns
  // the number of projects imported.
  async function seedIfEmpty() {
    const snap = await getDocs(collection(db, COLLECTION));
    if (!snap.empty) return 0;
    if (!auth || !auth.currentUser) return 0; // not allowed to write yet
    const batch = writeBatch(db);
    SEED_PROJECTS.forEach((p) => {
      batch.set(doc(db, COLLECTION, p.id), toDoc(p));
    });
    await batch.commit();
    return SEED_PROJECTS.length;
  }

  function ensureSeeded() {
    if (!seedPromise) {
      seedPromise = seedIfEmpty().catch((err) => {
        seedPromise = null; // don't cache a failed attempt
        throw err;
      });
    }
    return seedPromise;
  }

  return {
    seedIfEmpty,

    subscribeProjects(onChange, onError) {
      let unsub = () => {};
      let cancelled = false;
      ensureSeeded()
        .catch(() => {}) // seeding is best-effort
        .then(() => {
          if (cancelled) return;
          const q = query(
            collection(db, COLLECTION),
            orderBy('createdAt', 'desc'),
          );
          unsub = onSnapshot(
            q,
            (snap) => {
              const items = snap.docs.map((d) =>
                normaliseProject({ id: d.id, ...d.data() }),
              );
              onChange(sortProjects(items));
            },
            (err) => onError && onError(err),
          );
        });
      return () => {
        cancelled = true;
        unsub();
      };
    },

    async listProjects() {
      await ensureSeeded().catch(() => {});
      const snap = await getDocs(
        query(collection(db, COLLECTION), orderBy('createdAt', 'desc')),
      );
      return sortProjects(
        snap.docs.map((d) => normaliseProject({ id: d.id, ...d.data() })),
      );
    },

    async createProject(data) {
      const body = toDoc({ ...data, createdAt: new Date().toISOString() });
      const ref = await addDoc(collection(db, COLLECTION), body);
      return normaliseProject({ id: ref.id, ...body });
    },

    async updateProject(id, data) {
      const body = toDoc(data);
      delete body.createdAt; // keep original creation date
      await updateDoc(doc(db, COLLECTION, id), body);
    },

    async deleteProject(id) {
      await deleteDoc(doc(db, COLLECTION, id));
    },
  };
}

// ===============================================================
//  LOCAL STORAGE IMPLEMENTATION (fallback)
// ===============================================================

function localStore() {
  const listeners = new Set();

  function read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).map(normaliseProject);
    } catch {
      /* ignore corrupt storage */
    }
    const seeded = SEED_PROJECTS.map(normaliseProject);
    write(seeded);
    return seeded;
  }

  function write(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* quota / private mode - keep working in memory only */
    }
  }

  function emit() {
    const data = sortProjects(read());
    listeners.forEach((cb) => cb(data));
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) emit();
    });
  }

  function genId() {
    return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  }

  return {
    // local storage seeds itself on first read; nothing to import
    async seedIfEmpty() {
      return 0;
    },

    subscribeProjects(onChange) {
      listeners.add(onChange);
      onChange(sortProjects(read()));
      return () => listeners.delete(onChange);
    },

    async listProjects() {
      return sortProjects(read());
    },

    async createProject(data) {
      const list = read();
      const project = normaliseProject({
        ...data,
        id: genId(),
        createdAt: new Date().toISOString(),
      });
      write([project, ...list]);
      emit();
      return project;
    },

    async updateProject(id, data) {
      const next = read().map((p) =>
        p.id === id
          ? normaliseProject({ ...p, ...data, id, createdAt: p.createdAt })
          : p,
      );
      write(next);
      emit();
    },

    async deleteProject(id) {
      write(read().filter((p) => p.id !== id));
      emit();
    },
  };
}

// ===============================================================
//  EXPORT — pick the active backend once
// ===============================================================

const store = isFirebaseConfigured ? firestoreStore() : localStore();

export const projectsBackend = isFirebaseConfigured ? 'firebase' : 'local';

export const subscribeProjects = (...a) => store.subscribeProjects(...a);
export const listProjects = (...a) => store.listProjects(...a);
export const createProject = (...a) => store.createProject(...a);
export const updateProject = (...a) => store.updateProject(...a);
export const deleteProject = (...a) => store.deleteProject(...a);
export const seedIfEmpty = (...a) => store.seedIfEmpty(...a);
