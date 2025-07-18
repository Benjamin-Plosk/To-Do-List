import os
from sqlmodel import SQLModel, create_engine

# Pega a URL do banco da variável de ambiente, ou usa o padrão local
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./notas.db")

engine = create_engine(DATABASE_URL, echo=True)

def criar_bd():
    SQLModel.metadata.create_all(engine)
