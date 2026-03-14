from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import BASE_DIR, settings


database_url = settings.database_url
if database_url.startswith('sqlite:///./'):
    relative = database_url.replace('sqlite:///./', '', 1)
    database_url = f"sqlite:///{(BASE_DIR / relative).as_posix()}"

connect_args = {'check_same_thread': False} if database_url.startswith('sqlite') else {}
engine = create_engine(database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
