# Memora Backend MVP (FastAPI)

This backend implements the MVP API from `../plan.md`:

- `GET /v1/auth/session` (Clerk bearer token validation)
- `POST /v1/upload/sign`
- `POST /v1/cards`
- `GET /v1/cards`
- `GET /v1/cards/{id}`
- `PATCH /v1/cards/{id}`
- `DELETE /v1/cards/{id}`
- `GET /v1/cards/{id}/analytics`
- `POST /v1/internal/cards/{id}/compiled`
- `GET /v1/viewer/{card_id}`

## Run

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Notes

- Uses SQLite for local MVP persistence at `data/memora.db`.
- Generates local QR PNG files in `data/qr`.
- Uses Clerk JWT verification through JWKS (`CLERK_ISSUER` or `CLERK_JWKS_URL`).
- Uses Cloudinary signed uploads via `POST /v1/upload/sign`.
- Cards can carry real uploaded `.mind` target URLs for MindAR runtime in frontend.

## Render deployment

Use these settings for a Python Web Service:

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

This backend pins Python via `runtime.txt` to avoid `pydantic-core` source builds on unsupported runtimes.
