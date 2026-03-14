'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api-client';

export default function DashboardPage() {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState('');
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    async function loadCards() {
      try {
        const token = await getToken();
        if (!token) {
          setError('Please sign in to continue.');
          return;
        }
        const response = await api.listCards(token);
        setCards(response.cards || []);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    if (isLoaded) {
      loadCards();
    }
  }, [getToken, isLoaded]);

  const totalScans = useMemo(() => cards.reduce((sum, card) => sum + card.scan_count, 0), [cards]);

  async function onDelete(cardId) {
    try {
      const token = await getToken();
      if (!token) return;
      await api.deleteCard(token, cardId);
      const response = await api.listCards(token);
      setCards(response.cards || []);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <main className="container py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#E8734A]">Creator Dashboard</p>
          <h1 className="mt-2 text-4xl">Your Memora Cards</h1>
          <p className="mt-2 text-sm text-[#8c7355]">{cards.length} cards · {totalScans} total scans</p>
        </div>
        <Link href="/cards/new" className="btn-primary">Create New Card</Link>
      </div>
      {error && <p className="mb-4 text-sm text-[#E84A4A]">{error}</p>}

      <div className="grid gap-4">
        {cards.map((card) => (
          <article key={card.id} className="card grid gap-4 md:grid-cols-[120px_1fr_auto] md:items-center">
            <img src={card.photo_url} alt={card.name} className="h-24 w-full rounded-xl object-cover md:w-[120px]" />
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8c7355]">{new Date(card.created_at).toLocaleDateString()}</p>
              <h2 className="mt-1 text-xl">{card.name}</h2>
              <p className="text-sm text-[#8c7355]">{card.media_type.toUpperCase()} · {card.scan_count} scans · {card.is_public ? 'Public' : 'Private'}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/cards/${card.id}`} className="btn-secondary px-4 py-2 text-xs">Manage</Link>
              <button onClick={() => onDelete(card.id)} className="btn-secondary px-4 py-2 text-xs" type="button">
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
