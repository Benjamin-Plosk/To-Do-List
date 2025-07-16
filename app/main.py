from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.models import Nota
from app.database import engine, criar_bd

app = FastAPI()


# Permitir chamadas JS do navegador
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Banco
criar_bd()

# Ponto para servir arquivos CSS/JS
app.mount("/static", StaticFiles(directory="static"), name="static")

# Ponto para usar HTML com Jinja2
templates = Jinja2Templates(directory="templates")

# Página inicial
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/api/notas")
async def listar_notas():
    with Session(engine) as session:
        notas = session.exec(select(Nota)).all()
        return notas
    
@app.post("/api/notas")
async def adicionar_nota(nota: Nota):
    with Session(engine) as session:
        session.add(nota)
        session.commit()
        session.refresh(nota)
        return nota

@app.delete("/api/notas/{nota_id}")
async def deletar_nota(nota_id: int):
    with Session(engine) as session:
        nota = session.get(Nota, nota_id)
        if nota:
            session.delete(nota)
            session.commit()
        return {"ok": True}

# Exemplo de API que retorna JSON
@app.get("/api/mensagem")
async def get_msg():
    return {"msg": "Hello world!"}
