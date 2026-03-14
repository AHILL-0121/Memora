import { NextResponse } from 'next/server';

const cards = [
  {
    id: 'demo-card',
    name: 'Our Wedding Day',
    status: 'ready',
    scan_count: 42,
    viewer_url: '/view/demo-card'
  }
];

export async function GET() {
  return NextResponse.json({ cards, total: cards.length });
}

export async function POST(request) {
  const body = await request.json();
  const card = {
    id: crypto.randomUUID(),
    name: body.name || 'My Memora Card',
    status: 'processing',
    scan_count: 0,
    viewer_url: '/view/new-card'
  };

  return NextResponse.json(card, { status: 201 });
}
