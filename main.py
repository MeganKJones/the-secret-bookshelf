from fastapi import FastAPI
from database import engine
import models
from routers import auth
from routers import books
from fastapi import Request
from fastapi.staticfiles import StaticFiles
from fastapi import status
from fastapi.responses import RedirectResponse

app = FastAPI()

models.Base.metadata.create_all(bind=engine)


app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def test(request: Request):
    return RedirectResponse(url="/books/my_books", status_code=status.HTTP_302_FOUND)

app.include_router(auth.router)
app.include_router(books.router)