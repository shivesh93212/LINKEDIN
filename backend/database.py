from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
print("DATABASE_URL:", DATABASE_URL)
if not DATABASE_URL:
    raise RuntimeError("DATABASE NOT FOUND")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    connect_args={"sslmode": "require"}   # 👈 Render PostgreSQL fix
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False
)

Base = declarative_base()
print("DB URL:", repr(DATABASE_URL))
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
