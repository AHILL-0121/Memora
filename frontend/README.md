# Memora Frontend MVP

This folder contains the Next.js 14 frontend for Memora, implemented from `../plan.md` and styled from `../sampleui.md`.

## Included pages

- `/` landing page using Memora Lumina styling
- `/sign-in` and `/sign-up` via Clerk components
- `/dashboard` card management list via backend API
- `/cards/new` four-step card creation wizard with signed Cloudinary uploads
- `/cards/[id]` card detail with QR code and viewer link
- `/view/[cardId]` public viewer with MindAR runtime when `.mind` target is available

## Backend integration

Set `NEXT_PUBLIC_API_BASE_URL` in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/v1
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
```

## Run locally

1. Install dependencies
2. Start dev server

```powershell
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Notes

- Auth, cards, viewer, and analytics calls are wired through `lib/api-client.js`.
- MindAR runtime is implemented in `components/mindar-viewer.js` and requires card `target_url` to be a valid `.mind` file.
