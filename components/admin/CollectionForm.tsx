"use client";
import React, { useState } from 'react';

type CollectionPayload = {
  name: string;
  description?: string;
  banner_image?: string | null;
};

export const CollectionForm: React.FC = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      let bannerUrl: string | null = null;
      if (file) {
        const form = new FormData();
        form.append('file', file);
        const res = await fetch('/api/upload/collection', { method: 'POST', body: form });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        bannerUrl = data.url;
      }

      const payload: CollectionPayload = { name, description, banner_image: bannerUrl };
      const createRes = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!createRes.ok) throw new Error(await createRes.text());
      setSuccess('Collection created');
      setName('');
      setDescription('');
      setFile(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to create collection');
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
        <label className="block text-sm font-medium mb-1">Banner Image</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded">
        {submitting ? 'Saving...' : 'Create Collection'}
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
    </form>
  );
};


