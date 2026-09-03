// ===============================================================
//  ImageField — reusable "link or upload" image input
// ===============================================================
//  Used by the project form (cover image) and the About editor
//  (skill icons). `value` / `onChange` hold a string: an https URL,
//  a /relative path, a data: URI, or (when iconMode) a technology
//  name like "react".
// ===============================================================
import { useState } from 'react';
import { uploadImage, ACCEPTED_IMAGE_TYPES } from '../../lib/imageUpload';

function previewable(v) {
  if (!v) return false;
  return (
    /^https?:\/\//i.test(v) ||
    v.startsWith('/') ||
    v.startsWith('data:image/')
  );
}

export default function ImageField({
  value = '',
  onChange,
  onBlur,
  folder = 'images',
  iconMode = false,
  compact = false,
  invalid = false,
  id,
}) {
  const [mode, setMode] = useState('link');
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setUploading(true);
    setErr('');
    try {
      const url = await uploadImage(file, { folder });
      onChange(url);
    } catch (ex) {
      setErr((ex && ex.message) || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="admin-imgfield">
      <div className="admin-seg" role="tablist">
        <button
          type="button"
          className={`admin-seg__btn ${mode === 'link' ? 'is-on' : ''}`}
          onClick={() => setMode('link')}
        >
          {iconMode ? 'Name / URL' : 'Link'}
        </button>
        <button
          type="button"
          className={`admin-seg__btn ${mode === 'upload' ? 'is-on' : ''}`}
          onClick={() => setMode('upload')}
        >
          Upload
        </button>
      </div>

      {mode === 'link' ? (
        <input
          id={id}
          className={`admin-input ${invalid ? 'admin-input--invalid' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={
            iconMode ? 'react   ·   or https://…' : 'https://… or /assets/pic.jpg'
          }
        />
      ) : (
        <input
          type="file"
          className="admin-input admin-file-input"
          accept={ACCEPTED_IMAGE_TYPES}
          onChange={handleFile}
          disabled={uploading}
        />
      )}

      {uploading && <p className="admin-hint">Uploading…</p>}
      {err && <p className="admin-error">{err}</p>}

      {previewable(value) && (
        <img
          className={`admin-preview ${compact ? 'admin-preview--sm' : ''}`}
          src={value}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
    </div>
  );
}
