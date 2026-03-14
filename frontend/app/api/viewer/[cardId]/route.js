import { NextResponse } from 'next/server';

export async function GET(_request, { params }) {
  return NextResponse.json({
    id: params.cardId,
    photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    media_url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    media_type: 'video',
    target_url: '/targets/demo-card.mind',
    status: 'ready'
  });
}
