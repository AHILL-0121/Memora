from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(BASE_DIR / '.env', BASE_DIR / '.env.local'),
        extra='ignore'
    )

    app_name: str = 'Memora API'
    app_env: str = 'development'
    app_port: int = 8000

    backend_base_url: str = 'http://localhost:8000'
    public_base_url: str = 'http://localhost:3000'
    cors_origins: str = 'http://localhost:3000,http://127.0.0.1:3000,https://sa-memora.vercel.app'

    database_url: str = f"sqlite:///{(BASE_DIR / 'data' / 'memora.db').as_posix()}"
    private_signed_url_minutes: int = 30

    clerk_publishable_key: str = ''
    clerk_secret_key: str = ''
    clerk_issuer: str = ''
    clerk_jwks_url: str = ''
    clerk_test_jwt: str = ''

    cloudinary_cloud_name: str = ''
    cloudinary_api_key: str = ''
    cloudinary_api_secret: str = ''


settings = Settings()
