import pdfplumber
import PyPDF2
from typing import List

class PDFProcessor:
    @staticmethod
    def extract_text_pdfplumber(pdf_path: str) -> str:
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text

    @staticmethod
    def extract_text_pypdf2(pdf_path: str) -> str:
        text = ""
        with open(pdf_path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() or ""
        return text

    @staticmethod
    def clean_text(text: str) -> str:
        # Basic cleaning: strip, remove excessive whitespace
        return ' '.join(text.split())
