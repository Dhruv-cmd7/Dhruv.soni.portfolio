import os

def extract_pdf_text():
    # Try importing various pdf parsing libraries
    try:
        import pypdf
        print("Using pypdf")
        reader = pypdf.PdfReader("Dhruv_soni_resume.pdf")
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except ImportError:
        pass

    try:
        import PyPDF2
        print("Using PyPDF2")
        reader = PyPDF2.PdfReader("Dhruv_soni_resume.pdf")
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except ImportError:
        pass

    try:
        import pdfplumber
        print("Using pdfplumber")
        with pdfplumber.open("Dhruv_soni_resume.pdf") as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
            return text
    except ImportError:
        pass

    try:
        from pdfminer.high_level import extract_text
        print("Using pdfminer")
        return extract_text("Dhruv_soni_resume.pdf")
    except ImportError:
        pass

    print("No pdf library found. Trying to see if pip can install pypdf...")
    return None

text = extract_pdf_text()
if text:
    with open("resume_extracted.txt", "w", encoding="utf-8") as f:
        f.write(text)
    print("Successfully wrote resume_extracted.txt")
else:
    print("Could not extract text")
