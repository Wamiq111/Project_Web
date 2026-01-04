import os
from pdf2docx import Converter
from docx2pdf import convert as docx_to_pdf_convert
import img2pdf
import fitz  # PyMuPDF
from typing import List

def pdf_to_word(pdf_path: str, word_path: str):
    cv = Converter(pdf_path)
    cv.convert(word_path, start=0, end=None)
    cv.close()

def word_to_pdf(word_path: str, pdf_path: str):
    # This requires Microsoft Word installed on Windows
    # On Linux, LibreOffice is needed.
    docx_to_pdf_convert(word_path, pdf_path)

def jpg_to_pdf(jpg_paths: List[str], pdf_path: str):
    with open(pdf_path, "wb") as f:
        f.write(img2pdf.convert(jpg_paths))

def pdf_to_jpg(pdf_path: str, output_folder: str):
    doc = fitz.open(pdf_path)
    image_paths = []
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    for i, page in enumerate(doc):
        pix = page.get_pixmap()
        img_path = os.path.join(output_folder, f"page_{i+1}.jpg")
        pix.save(img_path)
        image_paths.append(img_path)
    doc.close()
    return image_paths
