// ===============================================================
//  ABOUT CONTENT STORE  —  single document ( content/about )
// ===============================================================
//  Public API:
//     subscribeAbout(onChange, onError) -> unsubscribe()
//     getAbout()                         -> Promise<About>
//     saveAbout(data)                    -> Promise<void>   (admin only)
//     seedAboutIfEmpty()                 -> Promise<number>
//
//  Backend chosen automatically (same rule as the other stores):
//     Firestore  when VITE_FIREBASE_* is set, else localStorage.
// ===============================================================

import {
  doc,
  onSnapshot,
  getDoc,
  setDoc,
} from 'firebase/firestore';

import { isFirebaseConfigured, db, auth } from '../lib/firebase';
import { ABOUT_DEFAULTS } from './aboutDefaults';

const STORAGE_KEY = 'portfolio.about.v1';
const DOC_PATH = ['content', 'about'];

// ---------------------------------------------------------------
//  Helpers
// ---------------------------------------------------------------

const arr = (v) => (Array.isArray(v) ? v : []);

/** Merge a stored doc onto the defaults so the shape is always complete. */
export function normaliseAbout(raw) {
  const d = raw || {};
  return {
    personalInfo: arr(d.personalInfo).length
      ? arr(d.personalInfo).map((r) => ({
          title: r.title || '',
          description: r.description || '',
          link: r.link || '',
        }))
      : ABOUT_DEFAULTS.personalInfo,
    stats: arr(d.stats).length
      ? arr(d.stats).map((r) => ({ no: r.no || '', title: r.title || '' }))
      : ABOUT_DEFAULTS.stats,
    skills: arr(d.skills).length
      ? arr(d.skills).map((r, i) => ({
          id: String(r.id || i + 1),
          title: r.title || '',
          level: r.level || '',
          category: r.category === 'Backend' ? 'Backend' : 'Frontend',
          icon: r.icon || '',
        }))
      : ABOUT_DEFAULTS.skills,
    resume: arr(d.resume).length
      ? arr(d.resume).map((r, i) => ({
          id: String(r.id || i + 1),
          category: r.category === 'education' ? 'education' : 'experience',
          iconName: r.iconName === 'briefcase' ? 'briefcase' : 'graduation',
          year: r.year || '',
          title: r.title || '',
          desc: r.desc || '',
        }))
      : ABOUT_DEFAULTS.resume,
  };
}

// ===============================================================
//  FIRESTORE
// ===============================================================

function firestoreStore() {
  const ref = () => doc(db, ...DOC_PATH);
  let seedPromise = null;

  async function seedIfEmpty() {
    const snap = await getDoc(ref());
    if (snap.exists()) return 0;
    if (!auth || !auth.currentUser) return 0;
    await setDoc(ref(), { ...ABOUT_DEFAULTS, updatedAt: new Date().toISOString() });
    return 1;
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
    seedAboutIfEmpty: seedIfEmpty,

    subscribeAbout(onChange, onError) {
      let unsub = () => {};
      let cancelled = false;
      ensureSeeded()
        .catch(() => {})
        .then(() => {
          if (cancelled) return;
          unsub = onSnapshot(
            ref(),
            (snap) => onChange(normaliseAbout(snap.exists() ? snap.data() : null)),
            (err) => onError && onError(err),
          );
        });
      return () => {
        cancelled = true;
        unsub();
      };
    },

    async getAbout() {
      await ensureSeeded().catch(() => {});
      const snap = await getDoc(ref());
      return normaliseAbout(snap.exists() ? snap.data() : null);
    },

    async saveAbout(data) {
      const clean = normaliseAbout(data);
      await setDoc(ref(), { ...clean, updatedAt: new Date().toISOString() });
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
      if (raw) return normaliseAbout(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    return normaliseAbout(null);
  }

  function write(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }

  function emit() {
    const data = read();
    listeners.forEach((cb) => cb(data));
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) emit();
    });
  }

  return {
    async seedAboutIfEmpty() {
      return 0;
    },

    subscribeAbout(onChange) {
      listeners.add(onChange);
      onChange(read());
      return () => listeners.delete(onChange);
    },

    async getAbout() {
      return read();
    },

    async saveAbout(data) {
      write(normaliseAbout(data));
      emit();
    },
  };
}

// ===============================================================
//  EXPORT
// ===============================================================

const store = isFirebaseConfigured ? firestoreStore() : localStore();

export const aboutBackend = isFirebaseConfigured ? 'firebase' : 'local';

export const subscribeAbout = (...a) => store.subscribeAbout(...a);
export const getAbout = (...a) => store.getAbout(...a);
export const saveAbout = (...a) => store.saveAbout(...a);
export const seedAboutIfEmpty = (...a) => store.seedAboutIfEmpty(...a);
