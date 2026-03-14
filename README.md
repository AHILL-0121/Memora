# Memora MVP (Frontend + Backend)

Implemented from `plan.md` and `sampleui.md` as a complete local MVP stack.

## Project structure

- `frontend/` — Next.js 14 creator portal + public viewer UI
- `backend/` — FastAPI API with auth, cards, viewer logging, analytics, upload signing, and compile callback

## What is implemented

### Frontend

- Landing page with Memora Lumina design language
- Auth pages (`/sign-in`, `/sign-up`) powered by Clerk
- Card wizard (`/cards/new`) with signed Cloudinary file upload
- Dashboard (`/dashboard`) listing/deleting cards from backend
- Card detail (`/cards/[id]`) with visibility toggle and QR preview
- Public viewer (`/view/[cardId]`) with MindAR runtime if `.mind` target is available

### Backend

- `GET /v1/auth/session`
- `POST /v1/upload/sign`
- `POST /v1/cards`
- `GET /v1/cards`
- `GET /v1/cards/{id}`
- `PATCH /v1/cards/{id}`
- `DELETE /v1/cards/{id}`
- `GET /v1/cards/{id}/analytics`
- `GET /v1/viewer/{card_id}`
- `POST /v1/internal/cards/{id}/compiled`

Includes local SQLite persistence, generated QR assets, simulated `.mind` target files, scan logging, and analytics aggregation.

## Local run

### 1) Backend

```powershell
Set-Location .\backend
Copy-Item .env.example .env
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Fill `.env` with Clerk + Cloudinary keys before protected flows:

- `CLERK_ISSUER` (or `CLERK_JWKS_URL`)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### 2) Frontend

```powershell
Set-Location .\frontend
Copy-Item .env.local.example .env.local
npm install
npm run dev
```

Fill `.env.local` with:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Optional: `NEXT_PUBLIC_API_BASE_URL` (if omitted, frontend auto-targets `http://<current-host>:8000/v1` in browser)

Open `http://localhost:3000` on the same machine, or `http://<your-lan-ip>:3000` for phone testing.

## Cleanup generated files

The following generated artifacts are safe to delete anytime and will be recreated automatically:

- `backend/**/__pycache__/`
- `backend/**/*.pyc`
- `frontend/.next/`

PowerShell cleanup command:

```powershell
Set-Location .
Get-ChildItem -Path . -Directory -Recurse -Force | Where-Object { $_.Name -eq '__pycache__' } | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -Path . -File -Recurse -Force -Include *.pyc | Remove-Item -Force -ErrorAction SilentlyContinue
if (Test-Path .\frontend\.next) { Remove-Item .\frontend\.next -Recurse -Force -ErrorAction SilentlyContinue }
```

## Verification done

- Frontend `next build` succeeds.
- Backend compiles and imports successfully.
- Backend smoke test verifies health and can validate authenticated flows when `CLERK_TEST_JWT` is provided.
