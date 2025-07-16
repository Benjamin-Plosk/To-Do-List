from sqlmodel import SQLModel, Field
from typing import Optional

class Nota(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    conteudo: str
