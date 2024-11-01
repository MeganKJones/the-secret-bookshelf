# The Secret Library 📚

The Secret Library is a book tracking application built with **FastAPI** and **Python**. Users can log in, track, and manage books they've read, along with metadata like reading completion dates, ratings, and authors. This project demonstrates a complete REST API implementation using FastAPI, including authentication, CRUD operations, and a database connection.

## Features

- **User Authentication**: Secure user login and registration using JWT tokens.
- **Book Tracking**: Users can add, edit, delete, and view books they’ve read.
- **Custom Book Metadata**: Track book title, author, completed date, rating, and more.
- **Responsive API Design**: Built with FastAPI to ensure high performance and scalability.
  
## Prerequisites

- **Python 3.9+**
- **FastAPI**
- **SQLAlchemy**
- **A compatible database** (PostgreSQL, MySQL, SQLite, etc.)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/MeganKJones/the-secret-library.git
cd the-secret-library
```

### 2. Set Up a Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```
### 4. Environment Variables
```bash
DATABASE_URL=<your_database_url>
SECRET_KEY=<your_secret_key>
ALGORITHM=<your_algorithm>
```

### 5. Running the Application
```bash
uvicorn main:app --reload
```
