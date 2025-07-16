from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI()

# Ponto para servir arquivos CSS/JS
app.mount("/static", StaticFiles(directory="static"), name="static")

# Ponto para usar HTML com Jinja2
templates = Jinja2Templates(directory="templates")

# Página inicial
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Exemplo de API que retorna JSON
@app.get("/api/mensagem")
async def get_msg():
    return {"msg": "Hello world!"}
