import React, { useState, useRef } from 'react';
import { UploadCloud, X, Star, ArrowLeft, ArrowRight, Link as LinkIcon, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB per ARCHITECTURE.md Section 7
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export default function ImageUploader({ images = [], onChange, maxImages = 10 }) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // Validate files
  const validateFiles = (files) => {
    const valid = [];
    for (const file of files) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
        setErrorMsg(`"${file.name}" has an unsupported format. Only JPG, PNG, and WebP are allowed.`);
        return null;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setErrorMsg(`"${file.name}" exceeds the 5MB maximum file size.`);
        return null;
      }
      valid.push(file);
    }
    return valid;
  };

  // Handle uploading files
  const handleUploadFiles = async (files) => {
    setErrorMsg('');
    const validFiles = validateFiles(files);
    if (!validFiles || validFiles.length === 0) return;

    if (images.length + validFiles.length > maxImages) {
      setErrorMsg(`Maximum of ${maxImages} images allowed per listing.`);
      return;
    }

    setUploading(true);
    try {
      if (validFiles.length === 1) {
        const res = await api.uploadImage(validFiles[0]);
        if (res.url) {
          onChange([...images, res.url]);
        }
      } else {
        const res = await api.uploadMultipleImages(validFiles);
        if (res.urls && res.urls.length > 0) {
          onChange([...images, ...res.urls]);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(Array.from(e.dataTransfer.files));
    }
  };

  // Manual File Browse
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFiles(Array.from(e.target.files));
    }
  };

  // Add Direct URL
  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    const trimmed = urlInput.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/uploads/')) {
      setErrorMsg('Please enter a valid HTTP/HTTPS URL or /uploads path.');
      return;
    }
    if (images.length >= maxImages) {
      setErrorMsg(`Maximum of ${maxImages} images allowed.`);
      return;
    }
    setErrorMsg('');
    onChange([...images, trimmed]);
    setUrlInput('');
  };

  // Remove Image
  const handleRemove = (index) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  // Set as Cover Photo (Move to Index 0)
  const handleSetCover = (index) => {
    if (index === 0) return;
    const item = images[index];
    const updated = [item, ...images.filter((_, i) => i !== index)];
    onChange(updated);
  };

  // Move Position Left
  const handleMoveLeft = (index) => {
    if (index === 0) return;
    const updated = [...images];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  // Move Position Right
  const handleMoveRight = (index) => {
    if (index === images.length - 1) return;
    const updated = [...images];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: dragOver ? '2px dashed #000000' : '2px dashed #d1d5db',
          background: dragOver ? '#f3f4f6' : '#fafafa',
          borderRadius: '12px',
          padding: '28px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Loader2 size={32} className="animate-spin" color="#000000" />
            <span style={{ fontWeight: '600', color: '#111827', fontSize: '0.95rem' }}>
              Uploading & processing image files...
            </span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111827'
            }}>
              <UploadCloud size={24} />
            </div>
            <div>
              <span style={{ fontWeight: '700', color: '#000000', fontSize: '0.95rem' }}>
                Click to browse files
              </span>{' '}
              <span style={{ color: '#6b7280', fontSize: '0.95rem' }}>or drag and drop here</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              JPG, PNG, or WebP (Max 5MB each) • Up to {maxImages} high-res apartment photos
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '8px',
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          color: '#b91c1c',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Or Paste Direct URL */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <LinkIcon size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="url"
            placeholder="Or paste external image URL (e.g. Unsplash or CDN)..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(e); } }}
            className="form-input"
            style={{ paddingLeft: '34px', fontSize: '0.88rem' }}
          />
        </div>
        <button
          type="button"
          onClick={handleAddUrl}
          className="btn btn-secondary btn-sm"
          style={{ whiteSpace: 'nowrap', padding: '9px 14px' }}
        >
          Add URL
        </button>
      </div>

      {/* Image Gallery Grid */}
      {images.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            fontSize: '0.85rem',
            color: '#4b5563',
            fontWeight: '600'
          }}>
            <span>Listing Photos ({images.length} / {maxImages})</span>
            <span style={{ fontSize: '0.78rem', color: '#6b7280', fontWeight: '400' }}>
              First photo is the primary cover thumbnail
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px'
          }}>
            {images.map((imgUrl, idx) => (
              <div
                key={`${imgUrl}-${idx}`}
                style={{
                  position: 'relative',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: idx === 0 ? '2px solid #000000' : '1px solid #e5e7eb',
                  background: '#f3f4f6',
                  aspectRatio: '4/3',
                  boxShadow: idx === 0 ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Apartment preview ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80';
                  }}
                />

                {/* Primary Cover Badge */}
                {idx === 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '6px',
                      left: '6px',
                      background: '#000000',
                      color: '#ffffff',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <Star size={10} fill="#ffffff" /> Cover
                  </span>
                )}

                {/* Top-right delete button */}
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(0, 0, 0, 0.65)',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Remove image"
                >
                  <X size={13} />
                </button>

                {/* Bottom Action Strip */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    insetInline: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    padding: '4px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#ffffff',
                    fontSize: '0.72rem'
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => handleMoveLeft(idx)}
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '1px' }}
                        title="Move left"
                      >
                        <ArrowLeft size={13} />
                      </button>
                    )}
                    {idx < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleMoveRight(idx)}
                        style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '1px' }}
                        title="Move right"
                      >
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>

                  {idx !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#facc15',
                        cursor: 'pointer',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        padding: '1px 3px'
                      }}
                      title="Set as Cover"
                    >
                      Make Cover
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
