# Document Conversion Pro

A full-stack web application for document conversions, built with Next.js, FastAPI, and MongoDB.

## Features
- Signup/Login (Restricted to @gmail.com)
- PDF to Word Conversion
- Word to PDF Conversion
- JPG to PDF Conversion
- PDF to JPG Conversion

## Prerequisites
- Node.js & npm
- Python 3.8+
- MongoDB (Running locally or a cloud instance)
- **System Dependencies**:
  - **Poppler**: Required for PDF to JPG conversion.
  - **Microsoft Word**: Required on Windows for Word to PDF conversion (using `docx2pdf`).

## Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables
Create a `.env` file in the `backend` folder:
```env
MONGODB_URL=mongodb://localhost:27017
```
