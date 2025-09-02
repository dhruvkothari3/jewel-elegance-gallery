"use client";
import React, { useState } from 'react';

type ProductPayload = {
  name: string;
  description?: string;
  images?: string[];
};

export const ProductForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const imageUrls: string[] = [];
      if (files && files.length > 0) {
        for (const file of Array.from(files)) {
          const form = new FormData();
          form.append('file', file);
          const res = await fetch('/api/upload/product', { method: 'POST', body: form });
          if (!res.ok) throw new Error(await res.text());
          const data = await res.json();
          imageUrls.push(data.url);
        }
      }

      const payload: ProductPayload = { name, description, images: imageUrls };
      const createRes = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!createRes.ok) throw new Error(await createRes.text());
      setSuccess('Product created');
      setName('');
      setDescription('');
      setFiles(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea className="w-full border rounded px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Images</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} />
      </div>
      <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
        {submitting ? 'Saving...' : 'Create Product'}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
    </form>
  );
};


