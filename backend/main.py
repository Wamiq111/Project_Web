import sqlite3
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import os
import uuid
import zipfile
import shutil
from datetime import datetime
from converter import pdf_to_word, word_to_pdf, jpg_to_pdf, pdf_to_jpg
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Database Setup (SQLite)
DB_PATH = "database.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

UPLOAD_DIR = os.path.abspath("uploads")
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not email.endswith("@gmail.com"):
        return jsonify({"detail": "Only gmail.com emails are allowed"}), 400

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    
    if user:
        conn.close()
        return jsonify({"detail": "Email already registered"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    conn.execute('INSERT INTO users (email, password) VALUES (?, ?)', (email, hashed_password))
    conn.commit()
    conn.close()
    
    return jsonify({"message": "User registered successfully"})

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()
    conn.close()

    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"detail": "Invalid credentials"}), 400
    
    return jsonify({"message": "Login successful"})

@app.route("/convert/pdf-to-word", methods=["POST"])
def api_pdf_to_word():
    file = request.files.get("file")
    file_id = str(uuid.uuid4())
    pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    word_path = os.path.join(UPLOAD_DIR, f"{file_id}.docx")
    
    file.save(pdf_path)
    
    try:
        print(f"Converting PDF to Word: {pdf_path} -> {word_path}")
        pdf_to_word(pdf_path, word_path)
        print("Conversion successful")
        return send_file(word_path, as_attachment=True, download_name=f"{file.filename.split('.')[0]}.docx")
    except Exception as e:
        print(f"Conversion failed: {str(e)}")
        return jsonify({"detail": str(e)}), 500

@app.route("/convert/word-to-pdf", methods=["POST"])
def api_word_to_pdf():
    file = request.files.get("file")
    file_id = str(uuid.uuid4())
    word_path = os.path.join(UPLOAD_DIR, f"{file_id}.docx")
    pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    
    file.save(word_path)
    
    try:
        print(f"Converting Word to PDF: {word_path} -> {pdf_path}")
        word_to_pdf(word_path, pdf_path)
        print("Conversion successful")
        return send_file(pdf_path, as_attachment=True, download_name=f"{file.filename.split('.')[0]}.pdf")
    except Exception as e:
        print(f"Conversion failed: {str(e)}")
        return jsonify({"detail": str(e)}), 500

@app.route("/convert/jpg-to-pdf", methods=["POST"])
def api_jpg_to_pdf():
    files = request.files.getlist("files")
    file_id = str(uuid.uuid4())
    jpg_paths = []
    pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    
    for file in files:
        temp_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
        file.save(temp_path)
        jpg_paths.append(temp_path)
    
    try:
        print(f"Converting JPG to PDF: {jpg_paths} -> {pdf_path}")
        jpg_to_pdf(jpg_paths, pdf_path)
        print("Conversion successful")
        return send_file(pdf_path, as_attachment=True, download_name="converted.pdf")
    except Exception as e:
        print(f"Conversion failed: {str(e)}")
        return jsonify({"detail": str(e)}), 500

@app.route("/convert/pdf-to-jpg", methods=["POST"])
def api_pdf_to_jpg():
    file = request.files.get("file")
    file_id = str(uuid.uuid4())
    pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}.pdf")
    output_folder = os.path.join(UPLOAD_DIR, file_id)
    
    file.save(pdf_path)
    
    try:
        print(f"Converting PDF to JPG: {pdf_path} -> {output_folder}")
        image_paths = pdf_to_jpg(pdf_path, output_folder)
        print(f"Conversion successful, generated {len(image_paths)} images")
        zip_path = os.path.join(UPLOAD_DIR, f"{file_id}.zip")
        with zipfile.ZipFile(zip_path, 'w') as zipf:
            for img in image_paths:
                zipf.write(img, os.path.basename(img))
        return send_file(zip_path, as_attachment=True, download_name=f"{file.filename.split('.')[0]}_images.zip")
    except Exception as e:
        print(f"Conversion failed: {str(e)}")
        return jsonify({"detail": str(e)}), 500

@app.route("/")
def root():
    return jsonify({"message": "Document Converter Flask API is running"})

if __name__ == "__main__":
    app.run(port=8000, debug=True)
