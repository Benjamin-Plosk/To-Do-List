import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from app.models import Nota
from app.database import engine, criar_bd
from fastapi import HTTPException

app = FastAPI()

# Enable CORS for frontend JavaScript
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the database if it doesn't exist
criar_bd()

# Resolve base directory (project root, 1 level above /app)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Mount static files
static_path = os.path.join(BASE_DIR, "static")
app.mount("/static", StaticFiles(directory=static_path), name="static")

# Set up templates path
templates_path = os.path.join(BASE_DIR, "templates")
templates = Jinja2Templates(directory=templates_path)

# Home route
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Get all notes
@app.get("/api/notas")
async def listar_notas():
    with Session(engine) as session:
        notas = session.exec(select(Nota)).all()
        return notas

# Add a note
@app.post("/api/notas")
async def adicionar_nota(nota: Nota):
    with Session(engine) as session:
        session.add(nota)
        session.commit()
        session.refresh(nota)
        return nota

# Delete a note
@app.delete("/api/notas/{nota_id}")
async def deletar_nota(nota_id: int):
    with Session(engine) as session:
        nota = session.get(Nota, nota_id)
        if nota:
            session.delete(nota)
            session.commit()
        return {"ok": True}

# Update a note
@app.put("/api/notas/{nota_id}")
async def atualizar_nota(nota_id: int, nota: Nota):
    with Session(engine) as session:
        db_nota = session.get(Nota, nota_id)
        if not db_nota:
            raise HTTPException(status_code=404, detail="Nota não encontrada")
        db_nota.conteudo = nota.conteudo
        session.commit()
        session.refresh(db_nota)
        return db_nota

# Example JSON endpoint
@app.get("/api/mensagem")
async def get_msg():
    return {"msg": "Hello world!"}

@app.put("/api/notas/{nota_id}")
async def atualizar_nota(nota_id: int, nota_atualizada: Nota):
    with Session(engine) as session:
        nota = session.get(Nota, nota_id)
        if not nota:
            raise HTTPException(status_code=404, detail="Note not found")
        nota.conteudo = nota_atualizada.conteudo
        session.add(nota)
        session.commit()
        session.refresh(nota)
        return nota
