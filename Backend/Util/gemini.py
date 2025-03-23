import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel(model_name="gemini-2.0-flash")


def generate(text: str, generate_type: str, free: bool = False):

    if not text:
        return {"error": "No provided input text"}
    res = []
    
    if generate_type=='pdf_summary':
        res=generate_pdf_summary(text)
        
    elif generate_type=='paragraph_summary':
        res=generate_paragraph_summary(text)

    return res


def generate_pdf_summary(text: str):
     
    prompt = (
        "Given my research paper summarize the paper"
        f"{text}"
    )
    
    return get_output(prompt)


def generate_paragraph_summary(paragraph: str, summary: str):
    
    prompt = (
        "I am going to provide a paragrah and I want you to summarize it. "
        f"This is the context of the paragraph, CONTEXT: {summary}."
        f"This is the paragrah to summarize: {paragraph}"
    )
    
    return get_output(prompt)


def generate_technical_words(paragraph: str, summary: str):
    
    prompt = (
        "I am going to provide a paragrah and I want you to give me all of the uncommonly known "
        f" technical words and their definitions. PARAGRAPH: {paragraph}"
    )
    
    return get_output(prompt)


def get_output(prompt: str):
    try:
        response = model.generate_content(prompt)
        return response.strip()
    except Exception as e:
        return {"error": "Failed to Get Output", "devError": str(e)}

