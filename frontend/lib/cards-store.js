const storageKey = 'memora.cards';

const fallbackCards = [
  {
    id: 'demo-card',
    name: 'Our Wedding Day',
    mediaType: 'video',
    photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    mediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    isPublic: true,
    status: 'ready',
    scanCount: 42,
    createdAt: '2026-03-10T10:00:00.000Z'
  }
];

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getCards() {
  if (!canUseStorage()) return fallbackCards;

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    window.localStorage.setItem(storageKey, JSON.stringify(fallbackCards));
    return fallbackCards;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : fallbackCards;
  } catch {
    window.localStorage.setItem(storageKey, JSON.stringify(fallbackCards));
    return fallbackCards;
  }
}

export function saveCards(cards) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(storageKey, JSON.stringify(cards));
}

export function createCard(input) {
  const cards = getCards();
  const newCard = {
    id: crypto.randomUUID(),
    name: input.name || 'My Memora Card',
    mediaType: input.mediaType,
    photoUrl: input.photoUrl,
    mediaUrl: input.mediaUrl,
    isPublic: input.isPublic,
    status: 'ready',
    scanCount: 0,
    createdAt: new Date().toISOString()
  };
  const next = [newCard, ...cards];
  saveCards(next);
  return newCard;
}

export function getCardById(cardId) {
  return getCards().find((card) => card.id === cardId) || null;
}

export function updateCard(cardId, patch) {
  const cards = getCards();
  const next = cards.map((card) => (card.id === cardId ? { ...card, ...patch } : card));
  saveCards(next);
  return next.find((card) => card.id === cardId) || null;
}

export function deleteCard(cardId) {
  const cards = getCards();
  const next = cards.filter((card) => card.id !== cardId);
  saveCards(next);
}
