import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, readError } from '../api';
import Field from '../components/Field';

const EMPTY = { name: '', description: '', price: '', stock: '', category: 'Vegetables', images: [] };
const CATEGORIES = ['Fruits', 'Vegetables', 'Herbs', 'Pantry'];
const MAX_IMAGES = 5;
const PICTURES = [
  ['mango', 'Mango'], ['drumstick', 'Drumstick'], ['kokum', 'Kokum'], ['curry-leaves', 'Curry leaves'],
  ['ash-gourd', 'Ash gourd'], ['turmeric', 'Turmeric'], ['jamun', 'Jamun'], ['coriander', 'Coriander'],
];

/* ─── Multi-image drag-and-drop zone ─── */
function MultiDropZone({ images, onChange }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);
  const remaining = MAX_IMAGES - images.length;

  function readFiles(files) {
    const allowed = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .slice(0, remaining);
    if (!allowed.length) return;

    setUploading(true);
    setProgress(0);
    let loaded = 0;
    const results = [];

    allowed.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        results.push(e.target.result);
        loaded++;
        setProgress(Math.round((loaded / allowed.length) * 100));
        if (loaded === allowed.length) {
          onChange([...images, ...results]);
          // Animate progress to 100 then hide
          setTimeout(() => setUploading(false), 500);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    readFiles(e.dataTransfer.files);
  }

  function onInputChange(e) {
    readFiles(e.target.files);
    // Reset input so same file can be re-picked
    e.target.value = '';
  }

  function removeImage(idx) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function moveImage(from, to) {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }

  return (
    <div className="multi-drop-root">
      {/* Drop target — only show if slots remain */}
      {remaining > 0 && (
        <div
          className={`drop-zone${dragOver ? ' drag-over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Upload product images"
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            id="multi-drop-input"
            style={{ display: 'none' }}
            onChange={onInputChange}
          />
          <span className="drop-icon">{dragOver ? '📂' : '📷'}</span>
          <div className="drop-title">
            {images.length === 0
              ? 'Drag & drop up to 5 product images'
              : `Add ${remaining} more image${remaining !== 1 ? 's' : ''}`}
          </div>
          <div className="drop-sub">
            or <span>click to browse</span> · PNG, JPG, WEBP up to 10MB each
          </div>
          <div className="drop-slots">
            {Array.from({ length: MAX_IMAGES }).map((_, i) => (
              <div
                key={i}
                className={`drop-slot${i < images.length ? ' filled' : ''}${i === 0 ? ' primary' : ''}`}
              >
                {i < images.length ? '✓' : i + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload progress bar */}
      {uploading && (
        <div className="upload-progress" style={{ margin: '0.5rem 0' }}>
          <div className="upload-progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Image preview grid with remove + reorder */}
      {images.length > 0 && (
        <div className="multi-preview-grid">
          {images.map((src, idx) => (
            <div
              key={idx}
              className={`multi-preview-item${idx === 0 ? ' multi-preview-primary' : ''}`}
              draggable
              onDragStart={e => e.dataTransfer.setData('text/plain', idx)}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
                if (from !== idx) moveImage(from, idx);
              }}
            >
              <img
                src={src}
                alt={`Product image ${idx + 1}`}
                onError={e => { e.currentTarget.src = '/products/fallback.svg'; }}
              />
              {idx === 0 && <span className="multi-preview-badge">Cover</span>}
              <button
                type="button"
                className="drop-preview-remove"
                onClick={() => removeImage(idx)}
                aria-label={`Remove image ${idx + 1}`}
              >
                ✕
              </button>
            </div>
          ))}
          {/* Empty slot placeholders */}
          {Array.from({ length: MAX_IMAGES - images.length }).map((_, i) => (
            <div key={`empty-${i}`} className="multi-preview-item multi-preview-empty" onClick={() => remaining > 0 && inputRef.current?.click()}>
              <span>+</span>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="hint" style={{ marginTop: '0.4rem' }}>
          🔄 Drag images to reorder · First image is the cover photo · {images.length}/{MAX_IMAGES} uploaded
        </p>
      )}
    </div>
  );
}

/* ─── Main ProductForm ─── */
export default function ProductForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const nav = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [imageTab, setImageTab] = useState('upload');
  const [presetSelected, setPresetSelected] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (!editing) return;
    api.get(`/products/${id}`)
      .then(({ data: { product: p } }) => {
        // Support both old `image` field and new `images` array
        const imgs = p.images?.length ? p.images : (p.image ? [p.image] : []);
        setForm({
          name: p.name,
          description: p.description || '',
          price: String(p.price),
          stock: String(p.stock),
          category: p.category,
          images: imgs,
        });
      })
      .catch(e => setMessage(readError(e).message));
  }, [id, editing]);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErrors({});
    setMessage('');

    try {
      // Separate already-uploaded URLs from new base64 data: images
      const existingUrls = form.images.filter(s => !s.startsWith('data:'));
      const base64Images = form.images.filter(s => s.startsWith('data:'));

      let allUrls = existingUrls;

      // If there are new files to upload, send them to Cloudinary via our server
      if (base64Images.length > 0) {
        const formData = new FormData();
        // Convert base64 strings back to Blobs for upload
        for (const b64 of base64Images) {
          const res = await fetch(b64);
          const blob = await res.blob();
          formData.append('images', blob, 'upload.jpg');
        }
        const { data } = await api.post('/products/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        // Preserve original order: uploaded URLs replace the base64 slots
        allUrls = [...existingUrls, ...data.urls];
      }

      const body = {
        name: form.name,
        description: form.description,
        price: form.price === '' ? undefined : Number(form.price),
        stock: form.stock === '' ? undefined : Number(form.stock),
        category: form.category,
        image: allUrls[0] || presetSelected || '',
        images: allUrls,
      };

      if (editing) await api.put(`/products/${id}`, body);
      else await api.post('/products', body);
      nav('/shop');
    } catch (err) {
      const r = readError(err);
      setErrors(r.fields);
      setMessage(r.message);
      setBusy(false);
    }
  }

  // For the preset tab: add preset as first image
  function selectPreset(src) {
    setPresetSelected(src);
    if (!form.images.includes(src)) {
      if (form.images.length < MAX_IMAGES) {
        setForm(f => ({ ...f, images: [src, ...f.images.filter(i => !i.startsWith('/products/'))] }));
      }
    }
  }

  // For URL tab: add URL to images list
  const [urlInput, setUrlInput] = useState('');
  function addUrl() {
    const u = urlInput.trim();
    if (!u) return;
    if (form.images.length >= MAX_IMAGES) return;
    if (form.images.includes(u)) return;
    setForm(f => ({ ...f, images: [...f.images, u] }));
    setUrlInput('');
  }

  // Cover preview: first image in array
  const coverSrc = form.images[0] || '/products/fallback.svg';

  return (
    <section className="split">
      <div className="split-form">
        <form onSubmit={submit} noValidate>
          <h1>{editing ? 'Edit product' : 'Add a product'}</h1>
          <p className="sub">Buyers see this exactly as you write it.</p>
          {message && !Object.keys(errors).length && <p className="notice bad" role="alert">{message}</p>}

          <Field id="name" label="Product name" value={form.name} onChange={set('name')} error={errors.name} placeholder="e.g. Alphonso Mangoes" />
          <Field id="description" label="Description" as="textarea" rows={3} value={form.description} onChange={set('description')} error={errors.description} placeholder="Fresh from the farm…" />
          <div className="two">
            <Field id="price" label="Price (₹)" type="number" min="0" step="0.01" inputMode="decimal" value={form.price} onChange={set('price')} error={errors.price} placeholder="0.00" />
            <Field id="stock" label="Units in stock" type="number" min="0" step="1" inputMode="numeric" value={form.stock} onChange={set('stock')} error={errors.stock} placeholder="0" />
          </div>
          <Field id="category" label="Category" as="select" value={form.category} onChange={set('category')} error={errors.category}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </Field>

          {/* IMAGE SECTION */}
          <fieldset className="pics">
            <legend>
              Product Images
              <span className="image-count-badge">{form.images.length}/{MAX_IMAGES}</span>
            </legend>

            {/* Tab switcher */}
            <div className="image-tabs">
              {[['upload', '📤 Upload'], ['preset', '🖼️ Presets'], ['url', '🔗 URL']].map(([t, label]) => (
                <button
                  key={t}
                  type="button"
                  className="pill"
                  aria-pressed={imageTab === t}
                  onClick={() => setImageTab(t)}
                  style={{ fontSize: '0.82rem' }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* UPLOAD TAB */}
            {imageTab === 'upload' && (
              <MultiDropZone
                images={form.images}
                onChange={imgs => setForm(f => ({ ...f, images: imgs }))}
              />
            )}

            {/* PRESET TAB */}
            {imageTab === 'preset' && (
              <>
                <p className="hint" style={{ margin: '0.4rem 0 0.75rem' }}>
                  Click to add preset images to your collection ({MAX_IMAGES - form.images.length} slots left)
                </p>
                <div className="pic-row">
                  {PICTURES.map(([file, label]) => {
                    const src = `/products/${file}.svg`;
                    const inList = form.images.includes(src);
                    return (
                      <button
                        key={file}
                        type="button"
                        title={label}
                        aria-label={label}
                        aria-pressed={inList}
                        disabled={!inList && form.images.length >= MAX_IMAGES}
                        onClick={() => {
                          if (inList) {
                            setForm(f => ({ ...f, images: f.images.filter(i => i !== src) }));
                          } else {
                            selectPreset(src);
                          }
                        }}
                        style={{ position: 'relative' }}
                      >
                        <img src={src} alt="" />
                        {inList && (
                          <span style={{ position: 'absolute', top: 4, right: 4, background: 'var(--green)', color: '#fff', borderRadius: '50%', width: 18, height: 18, fontSize: '0.7rem', display: 'grid', placeItems: 'center' }}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* URL TAB */}
            {imageTab === 'url' && (
              <>
                <p className="hint" style={{ margin: '0.4rem 0 0.75rem' }}>
                  Paste image URLs one at a time ({MAX_IMAGES - form.images.length} slots left)
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
                    disabled={form.images.length >= MAX_IMAGES}
                    style={{ flex: 1, background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 'var(--radius-sm)', color: 'var(--ink)', font: 'inherit', padding: '0.7rem 0.9rem' }}
                  />
                  <button
                    type="button"
                    className="btn sm"
                    onClick={addUrl}
                    disabled={!urlInput.trim() || form.images.length >= MAX_IMAGES}
                  >
                    Add
                  </button>
                </div>
                {/* Show added URLs */}
                {form.images.filter(s => s.startsWith('http')).map((url, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.4rem', fontSize: '0.82rem', color: 'var(--ink-muted)', background: 'var(--surface)', padding: '0.4rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--line)' }}>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
                    <button type="button" style={{ background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer', fontSize: '1rem' }} onClick={() => setForm(f => ({ ...f, images: f.images.filter(u => u !== url) }))}>✕</button>
                  </div>
                ))}
              </>
            )}
          </fieldset>

          <button id="product-form-submit" className="btn block" disabled={busy}>
            {busy
              ? <><span className="spinner" style={{ marginRight: '0.4rem' }} /> Saving…</>
              : editing ? 'Save changes' : 'Add product'
            }
          </button>
        </form>
      </div>

      {/* LIVE PREVIEW PANEL */}
      <aside className="split-side sand">
        <div className="sand-glow" />
        <div className="preview">
          <img
            src={coverSrc.startsWith('data:') ? coverSrc : coverSrc}
            alt=""
            onError={e => { e.currentTarget.src = '/products/fallback.svg'; }}
          />
          {form.images.length > 1 && (
            <div className="preview-thumbs">
              {form.images.slice(0, 5).map((src, i) => (
                <img
                  key={i}
                  src={src.startsWith('data:') ? src : src}
                  alt=""
                  onError={e => { e.currentTarget.src = '/products/fallback.svg'; }}
                  className={i === 0 ? 'active' : ''}
                />
              ))}
            </div>
          )}
          <h3>{form.name || 'Your product name'}</h3>
          <p>₹{form.price || '0'} <span>{form.stock !== '' && `· ${form.stock} in stock`}</span></p>
        </div>
        <small>
          {form.images.length > 0
            ? `${form.images.length} image${form.images.length !== 1 ? 's' : ''} added · first is the cover`
            : 'Live preview — this is how it looks in the shop'}
        </small>
      </aside>
    </section>
  );
}
