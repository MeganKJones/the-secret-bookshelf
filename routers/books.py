from fastapi import HTTPException
from fastapi import APIRouter
from fastapi import Path
from fastapi import Depends
from database import SessionLocal
from typing import Annotated
from pydantic import BaseModel
from pydantic import Field
from sqlalchemy.orm import Session
from starlette import status
from models import Books
from .auth import get_current_user
from fastapi import Request
from starlette.responses import RedirectResponse
from datetime import date
from fastapi.templating import Jinja2Templates
from sqlalchemy import desc

templates = Jinja2Templates(directory="templates")

router = APIRouter(prefix="/books", tags=['books'])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class BookRequest(BaseModel):
    title: str = Field(min_length=3)
    author: str = Field(min_length=3, max_length=100)
    genre: str = Field(min_length=3, max_length=100)
    rating: int = Field(gt=0, lt=6)
    complete: bool
    completed_date: date | None = None
    published_date: date | None = None

def redirect_to_login():
    redirect_response = RedirectResponse('/auth/login-page', status_code=status.HTTP_302_FOUND)
    redirect_response.delete_cookie(key='access_token')
    return redirect_response

## Pages ##
@router.get("/my_books")
async def render_book_page(request: Request, db: db_dependency):
    try:
        user = await get_current_user(request.cookies.get("access_token"))
        if user is None:
            return redirect_to_login()

        books = db.query(Books).filter(Books.owner_id == user.get("id")).order_by(desc(Books.completed_date)).all()

        return templates.TemplateResponse("books.html", {"request": request, "books": books, "user": user})
    except:
        return redirect_to_login()

@router.get("/edit-book-page/{book_id}")
async def render_edit_book_page(request: Request, book_id: int, db: db_dependency):
    try:
        user = await get_current_user(request.cookies.get("access_token"))
        if user is None:
            return redirect_to_login()
        book = db.query(Books).filter(Books.id == book_id).first()

        return templates.TemplateResponse("edit-book.html", {"request": request, "book":book, "user": user})
    except Exception as e:
        print(e)
        return redirect_to_login()

@router.get("/add-book-page")
async def render_add_book_page(request: Request):
    try:
        user = await get_current_user(request.cookies.get("access_token"))
        if user is None:
            return redirect_to_login()
        return templates.TemplateResponse("add-book.html", {"request": request, "user": user})
    except:
        return redirect_to_login()


## Endpoints ##
@router.post("/add-book", status_code=status.HTTP_201_CREATED)
async def create_book(db: db_dependency, user: user_dependency, book_request: BookRequest):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed.")
    book_model = Books(**book_request.model_dump(), owner_id=user.get('id'))

    db.add(book_model)
    db.commit()


@router.get("/", status_code=status.HTTP_200_OK)
async def get_all_user_books(db: db_dependency, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed.")

    return db.query(Books).filter(Books.owner_id == user.get("id")).all()


@router.get("/all_books", status_code=status.HTTP_200_OK)
async def get_all_books(db: db_dependency, user: user_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed.")

    return db.query(Books).all()


@router.put("/book/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def update_book(db: db_dependency, user: user_dependency, book_request: BookRequest, book_id: int = Path(gt=0)):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed.")

    book_model = db.query(Books).filter(Books.id == book_id).filter(Books.owner_id == user.get('id')).first()
    if book_model is None:
        raise HTTPException(status_code=404, detail="Book not found.")

    book_model.title = book_request.title
    book_model.author = book_request.author
    book_model.genre = book_request.genre
    book_model.completed_date = book_request.completed_date
    book_model.published_date = book_request.published_date
    book_model.rating = book_request.rating
    book_model.complete = book_request.complete
    db.add(book_model)
    db.commit()