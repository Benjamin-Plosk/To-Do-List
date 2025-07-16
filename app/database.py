from sqlmodel import SQLModel, create_engine

sqlite_url = "sqlite:///notas.db"
engine = create_engine(sqlite_url, echo=True)

def criar_bd():
    SQLModel.metadata.create_all(engine)
