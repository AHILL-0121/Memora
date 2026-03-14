'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api-client';
import MindarViewer from '@/components/mindar-viewer';

export default function ViewerPage() {
  const params = useParams();
  const cardId = params?.cardId;
  const [status, setStatus] = useState('loading');
  const [card, setCard] = useState(null);

  useEffect(() => {
    if (!cardId) return;
    async function loadCard() {
      try {
        const found = await api.viewer(cardId);
        setCard(found);
      } catch {
        setStatus('not-found');
      }
    }

    async function requestCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setStatus('ready');
      } catch {
        setStatus('denied');
      }
    }

    loadCard().then(requestCamera);
  }, [cardId]);

  const message = useMemo(() => {
    if (status === 'loading') return 'Loading card data...';
    if (status === 'not-found') return 'Card not found.';
    if (status === 'unsupported') return 'Camera is not supported on this device.';
    if (status === 'denied') return 'Camera permission denied. Allow camera access to continue AR mode.';
    return 'Point your camera at the photo card to trigger overlay.';
  }, [status]);

  if (!card && status !== 'loading') {
    return (
      <main className="container py-16">
        <h1 className="text-3xl">Viewer unavailable</h1>
        <p className="mt-2 text-sm text-[#8c7355]">{message}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-[#D44A2A]">Return home</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#1A1208] px-4 py-8 text-white">
      <div className="mx-auto max-w-xl rounded-2xl border border-[#6d4f3b] bg-[#23170f] p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-[#F5C878]">Memora Viewer</p>
        <h1 className="mt-2 text-3xl">{card ? 'Memora Card Experience' : 'Loading...'}</h1>
        <p className="mt-3 text-sm text-[#e9cfb3]">{message}</p>

        {card && (
          <>
            <div className="mt-5 overflow-hidden rounded-xl border border-[#6d4f3b]">
              <img src={card.photo_url} alt="Memora card" className="h-64 w-full object-cover" />
            </div>
            <div className="mt-4 rounded-xl bg-[#2e1f15] p-4 text-sm">
              <p>Media type: {card.media_type.toUpperCase()}</p>
              <p className="mt-1">Media URL: {card.media_url}</p>
              <p className="mt-1">Target: {card.target_url || 'pending'}</p>
            </div>
            {card.target_url ? (
              <div className="mt-4">
                <MindarViewer targetUrl={card.target_url} mediaUrl={card.media_url} mediaType={card.media_type} />
              </div>
            ) : (
              <p className="mt-4 text-sm text-[#e9cfb3]">No `.mind` target linked yet. Upload a target file for AR tracking runtime.</p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
