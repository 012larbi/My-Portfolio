// ===============================================================
//  IMAGE UPLOAD
// ===============================================================
//  uploadImage(file) -> Promise<string>  (a URL to store in project.image)
//
//  Default (works on the Firebase *free / Spark* plan):
//    compress the image in the browser and return a data: URI, which
//    is stored inline in the Firestore document / localStorage.
//
//  Optional (needs the Blaze plan + Storage enabled):
//    set VITE_FIREBASE_USE_STORAGE=true and the file is uploaded to
//    Firebase Storage instead, returning its public download URL.
//
//  Raster images are downscaled with <canvas> before either path, so
//  documents stay small and uploads are fast. SVG / GIF pass through.
// ===============================================================

import { isFirebaseConfigured, app } from './firebase';

// Firebase Storage requires the Blaze plan on newer projects, so it is
// opt-in. Everything works on the free plan without it.
const USE_STORAGE =
  isFirebaseConfigured &&
  String(import.meta.env.VITE_FIREBASE_USE_STORAGE).toLowerCase() === 'true';

const START_DIM = 1600; // longest edge, px (first attempt)
const MIN_DIM = 700; // don't shrink below this
const QUALITY = 0.82;
// Firestore documents max out at ~1 MB; keep the whole data URI well under.
const INLINE_LIMIT = 820 * 1024;

export const ACCEPTED_IMAGE_TYPES =
  'image/jpeg,image/png,image/webp,image/gif,image/svg+xml';

function safeName(name = 'image') {
  return (
    name
      .toLowerCase()
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'image'
  );
}

function extFor(type, fallbackName) {
  if (type === 'image/jpeg') return 'jpg';
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  if (type === 'image/gif') return 'gif';
  if (type === 'image/svg+xml') return 'svg';
  const m = /\.([a-z0-9]+)$/i.exec(fallbackName || '');
  return m ? m[1].toLowerCase() : 'img';
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(new Error('Could not read the file.'));
    r.readAsDataURL(blob);
  });
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const el = new Image();
    el.onload = () => {
      URL.revokeObjectURL(url);
      resolve(el);
    };
    el.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That image could not be loaded.'));
    };
    el.src = url;
  });
}

/** Downscale a raster image to `maxDim`. Returns a Blob. */
async function compressToBlob(img, sourceType, maxDim) {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);

  const hasAlpha = sourceType === 'image/png' || sourceType === 'image/webp';
  const outType = hasAlpha ? 'image/webp' : 'image/jpeg';

  const blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), outType, QUALITY),
  );
  return blob || null;
}

/**
 * @param {File} file
 * @param {{ folder?: string }} [opts]
 * @returns {Promise<string>} a data: URI (default) or an https download URL
 */
export async function uploadImage(file, { folder = 'projects' } = {}) {
  if (!file) throw new Error('No file selected.');
  if (!/^image\//.test(file.type)) throw new Error('Please choose an image file.');

  const passthrough = file.type === 'image/svg+xml' || file.type === 'image/gif';

  // ---- Firebase Storage (opt-in, Blaze plan) -------------------
  if (USE_STORAGE && app) {
    let payload = file;
    if (!passthrough) {
      try {
        const img = await loadImage(file);
        const blob = await compressToBlob(img, file.type, START_DIM);
        if (blob && blob.size < file.size) payload = blob;
      } catch {
        payload = file;
      }
    }
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import(
      'firebase/storage'
    );
    const storage = getStorage(app);
    const type = payload.type || file.type;
    const path = `${folder}/${Date.now()}-${safeName(file.name)}.${extFor(
      type,
      file.name,
    )}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, payload, { contentType: type });
    return getDownloadURL(storageRef);
  }

  // ---- Inline data URI (default, free plan) --------------------
  if (passthrough) {
    const dataUrl = await blobToDataUrl(file);
    if (dataUrl.length > INLINE_LIMIT) {
      throw new Error(
        'This SVG/GIF is too large to store inline. Please use a smaller file or a hosted URL.',
      );
    }
    return dataUrl;
  }

  const img = await loadImage(file);
  for (let dim = START_DIM; dim >= MIN_DIM; dim -= 300) {
    const blob = await compressToBlob(img, file.type, dim);
    if (!blob) break;
    const dataUrl = await blobToDataUrl(blob);
    if (dataUrl.length <= INLINE_LIMIT) return dataUrl;
  }

  throw new Error(
    'Image is too detailed to store inline even after resizing. Use a smaller image, ' +
      'or enable Firebase Storage (VITE_FIREBASE_USE_STORAGE=true, Blaze plan).',
  );
}
