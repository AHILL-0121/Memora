'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api-client';

export default function CardDetailPage() {
  const params = useParams();
  const cardId = params?.id;
  const { getToken } = useAuth();
  const [card, setCard] = useState(null);
  const [error, setError] = useState('');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!cardId) return;
    async function loadCard() {
      try {
        const token = await getToken();
        if (!token) {
          setError('Please sign in to continue.');
          return;
        }
        const response = await api.getCard(token, cardId);
        setCard(response);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadCard();
  }, [cardId, getToken]);

  async function toggleVisibility() {
    if (!card) return;
    try {
      const token = await getToken();
      if (!token) return;
      const next = await api.updateCard(token, card.id, { is_public: !card.is_public });
      setCard(next);
    } catch (toggleError) {
      setError(toggleError.message);
    }
  }

  if (!card) {
    return (
      <main className="container py-16">
        <h1 className="text-3xl">Card not found</h1>
        <Link href="/dashboard" className="mt-4 inline-block text-sm text-[#D44A2A]">Back to dashboard</Link>
      </main>
    );
  }

  const viewerUrl = `/view/${card.id}`;
  const publicViewerUrl = origin ? `${origin}${viewerUrl}` : card.viewer_url || viewerUrl;

  return (
    <main className="container py-12">
      <p className="text-xs uppercase tracking-[0.18em] text-[#E8734A]">Card Detail</p>
      <h1 className="mt-2 text-4xl">{card.name}</h1>
      <p className="mt-2 text-sm text-[#8c7355]">Status: {card.status} · {card.scan_count} scans</p>
      {error && <p className="mt-2 text-sm text-[#E84A4A]">{error}</p>}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section className="card">
          <img src={card.photo_url} alt={card.name} className="h-auto w-full rounded-xl" />
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-secondary px-4 py-2 text-xs" onClick={toggleVisibility}>
              Set {card.is_public ? 'Private' : 'Public'}
            </button>
            <Link href={viewerUrl} className="btn-secondary px-4 py-2 text-xs">Open Viewer</Link>
            <Link href="/dashboard" className="btn-secondary px-4 py-2 text-xs">Back</Link>
          </div>
        </section>

        <section className="card">
          <h2 className="text-2xl">QR Code</h2>
          <p className="mt-2 text-sm text-[#8c7355]">Use this QR to launch the public WebAR viewer route.</p>
          <div className="mt-4 inline-flex rounded-2xl border border-[#ead9c2] bg-white p-4">
            <QRCodeSVG value={publicViewerUrl} size={180} />
          </div>
          <p className="mt-3 text-xs text-[#8c7355]">Viewer link: {publicViewerUrl}</p>
        </section>
      </div>
    </main>
  );
}
