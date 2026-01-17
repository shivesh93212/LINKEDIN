from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL=str(os.getenv("DATABASE_URL"))

if not DATABASE_URL:
    raise RuntimeError("DATABASE NOT FOUND ")

engine=create_engine(DATABASE_URL,pool_pre_ping=True)
SessionLocal=sessionmaker(bind=engine,autocommit=False,autoflush=False)

Base=declarative_base()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()