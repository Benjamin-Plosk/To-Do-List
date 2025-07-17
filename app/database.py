from sqlmodel import SQLModel, create_engine

engine = create_engine("sqlite:///notas.db")

def criar_bd():
    SQLModel.metadata.create_all(engine)
