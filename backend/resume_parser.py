# ===== IMPORT LIBRARIES =====
import pdfminer
import docx
from pdfminer.high_level import extract_text
import re
# ===== PDF TEXT EXTRACTION =====
def parse_pdf(file_path):
    text=extract_text(file_path)
    return text

# ===== DOCX TEXT EXTRACTION =====
def parse_docx(file_path):
    doc=docx.Document(file_path)
    full_text=[]
    for para in doc.paragraphs:
        full_text.append(para.text)
    return " ".join(full_text)

# ===== UNIVERSAL RESUME PARSER =====
def parse_resume(file_path):
    if file_path.endswith(".pdf"):
        return parse_pdf(file_path)
    elif file_path.endswith(".docx"):
        return parse_docx(file_path)
    elif file_path.endswith(".txt"):
        with open(file_path,"r",encoding="utf8") as f:
            return f.read()
    else:
        return ""
    
# ===== EMAIL EXTRACTION =====
def extract_email(text):

    email_pattern=r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"

    emails=re.findall(email_pattern,text)

    return emails[0] if emails else "Not Found"


# ===== NAME EXTRACTION (simple method) =====
def extract_name(text):

    lines=text.split("\n")

    for line in lines[:5]:
        if len(line.split())>=2 and len(line.split())<=4:
            return line.strip()

    return "Unknown"