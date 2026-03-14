'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { api, uploadToCloudinary } from '@/lib/api-client';

const steps = ['Upload Photo', 'Attach Media', 'Card Details', 'Generate'];

export default function NewCardPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: 'My Memora Card',
    photoUrl: '',
    mediaUrl: '',
    targetUrl: '',
    mediaType: 'video',
    isPublic: true
  });
  const [files, setFiles] = useState({
    photo: null,
    media: null,
    target: null
  });

  const canContinue = useMemo(() => {
    if (step === 0) return !!files.photo || !!form.photoUrl;
    if (step === 1) return !!files.media || !!form.mediaUrl;
    return true;
  }, [files.media, files.photo, form.mediaUrl, form.photoUrl, step]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function onGenerate() {
    setSubmitting(true);
    setError('');
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('Please sign in to create a card.');
      }

      let photoUrl = form.photoUrl;
      let mediaUrl = form.mediaUrl;
      let targetUrl = form.targetUrl;

      if (files.photo || files.media || files.target) {
        setUploading(true);
      }

      if (files.photo) {
        photoUrl = await uploadToCloudinary(token, files.photo, {
          folder: 'photos',
          resourceType: 'image'
        });
      }

      if (files.media) {
        mediaUrl = await uploadToCloudinary(token, files.media, {
          folder: 'media',
          resourceType: form.mediaType === 'video' ? 'video' : 'auto'
        });
      }

      if (files.target) {
        targetUrl = await uploadToCloudinary(token, files.target, {
          folder: 'targets',
          resourceType: 'raw'
        });
      }

      const created = await api.createCard(token, {
        name: form.name,
        photo_url: photoUrl,
        media_url: mediaUrl,
        target_url: targetUrl || null,
        media_type: form.mediaType,
        is_public: form.isPublic
      });
      router.push(`/cards/${created.id}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  }

  return (
    <main className="container py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-[#E8734A]">Card Wizard</p>
      <h1 className="mt-2 text-4xl">Create a Memora Card</h1>
      <p className="mt-2 text-sm text-[#8c7355]">Upload → Attach Media → Generate → Share</p>

      <ol className="mt-8 grid gap-2 sm:grid-cols-4">
        {steps.map((title, index) => (
          <li key={title} className={`card py-3 text-sm ${index === step ? 'border-[#E8734A]' : ''}`}>
            <span className="font-semibold">{String(index + 1).padStart(2, '0')}</span> {title}
          </li>
        ))}
      </ol>

      <section className="card mt-6 space-y-4">
        {step === 0 && (
          <>
            <h2 className="text-2xl">Upload Photo</h2>
            <p className="text-sm text-[#8c7355]">Upload JPEG/PNG photo file (or paste fallback URL).</p>
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="w-full rounded-xl border border-[#ead9c2] bg-white px-3 py-2"
              onChange={(event) => setFiles((current) => ({ ...current, photo: event.target.files?.[0] || null }))}
            />
            <input
              value={form.photoUrl}
              onChange={(event) => updateField('photoUrl', event.target.value)}
              className="w-full rounded-xl border border-[#ead9c2] bg-white px-3 py-2"
              placeholder="https://.../photo.jpg"
            />
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-2xl">Attach Media</h2>
            <div className="flex flex-wrap gap-2">
              {['video', 'gif', 'audio'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`btn-secondary px-4 py-2 text-xs ${form.mediaType === type ? 'border-[#E8734A] text-[#D44A2A]' : ''}`}
                  onClick={() => updateField('mediaType', type)}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>
            <input
              type="file"
              accept={form.mediaType === 'video' ? 'video/mp4' : form.mediaType === 'gif' ? 'image/gif' : 'audio/mpeg,audio/wav'}
              className="w-full rounded-xl border border-[#ead9c2] bg-white px-3 py-2"
              onChange={(event) => setFiles((current) => ({ ...current, media: event.target.files?.[0] || null }))}
            />
            <input
              value={form.mediaUrl}
              onChange={(event) => updateField('mediaUrl', event.target.value)}
              className="w-full rounded-xl border border-[#ead9c2] bg-white px-3 py-2"
              placeholder="https://.../media.mp4"
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl">Card Details</h2>
            <label className="block text-sm">
              Card name
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="mt-1 w-full rounded-xl border border-[#ead9c2] bg-white px-3 py-2"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(event) => updateField('isPublic', event.target.checked)}
              />
              Public card (shareable without sign-in)
            </label>
            <label className="block text-sm">
              MindAR target file (.mind)
              <input
                type="file"
                accept=".mind"
                className="mt-1 w-full rounded-xl border border-[#ead9c2] bg-white px-3 py-2"
                onChange={(event) => setFiles((current) => ({ ...current, target: event.target.files?.[0] || null }))}
              />
            </label>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl">Generate Memora Card</h2>
            <p className="text-sm text-[#8c7355]">This simulates target compilation and QR generation for the MVP frontend.</p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-[#8c7355]">
              <li>Name: {form.name}</li>
              <li>Media type: {form.mediaType.toUpperCase()}</li>
              <li>Visibility: {form.isPublic ? 'Public' : 'Private'}</li>
              <li>Target: {files.target ? files.target.name : form.targetUrl ? 'Provided URL' : 'Pending (can add later)'}</li>
            </ul>
          </>
        )}

        <div className="flex justify-between pt-2">
          <button type="button" className="btn-secondary" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
            Back
          </button>
          {step < steps.length - 1 ? (
            <button type="button" className="btn-primary" disabled={!canContinue} onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))}>
              Continue
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={onGenerate} disabled={submitting}>
              {submitting ? (uploading ? 'Uploading files...' : 'Generating...') : 'Generate Card'}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-[#E84A4A]">{error}</p>}
      </section>
    </main>
  );
}
