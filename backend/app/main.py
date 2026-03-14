from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import inspect

from app.api.routes import auth, cards, internal, upload, viewer
from app.core.config import BASE_DIR, settings
from app.db import Base, engine


def ensure_schema():
    inspector = inspect(engine)
    if 'cards' in inspector.get_table_names():
        columns = {column['name'] for column in inspector.get_columns('cards')}
        if 'clerk_user_id' not in columns:
            Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


ensure_schema()

app = FastAPI(title=settings.app_name, version='1.0.0')

cors_origins = [origin.strip() for origin in settings.cors_origins.split(',') if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

app.include_router(auth.router, prefix='/v1')
app.include_router(cards.router, prefix='/v1')
app.include_router(internal.router, prefix='/v1')
app.include_router(upload.router, prefix='/v1')
app.include_router(viewer.router, prefix='/v1')

assets_dir = BASE_DIR / 'data'
Path(assets_dir / 'qr').mkdir(parents=True, exist_ok=True)
Path(assets_dir / 'targets').mkdir(parents=True, exist_ok=True)
app.mount('/assets', StaticFiles(directory=str(assets_dir)), name='assets')


@app.get('/health')
def healthcheck():
    return {'status': 'ok', 'service': settings.app_name}
