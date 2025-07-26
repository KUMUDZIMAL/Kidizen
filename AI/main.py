# main.py
# Run with: uvicorn main:app --host 127.0.0.1 --port 5000

import os
import tempfile
import json
import re
import random
import ffmpeg
import whisper
import requests

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from keybert import KeyBERT
import spacy
import uvicorn

# ————————————————
# Configuration
# ————————————————
load_dotenv()  # loads from .env in project root if available

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL     = os.getenv("GROQ_URL", "https://api.groq.com/openai/v1/chat/completions")
LLM_MODEL    = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ————————————————
# NLP Preprocessing Helpers
# ————————————————
# Load models once
nlp         = spacy.load("en_core_web_sm")
kw_model    = KeyBERT()
summarizer  = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text: str, max_length: int = 200) -> str:
    out = summarizer(text, max_length=max_length, min_length=50, do_sample=False)
    return out[0]["summary_text"]

def chunk_sentences(text: str, max_tokens: int = 200) -> list[str]:
    doc = nlp(text)
    chunks = []
    cur = ""
    for sent in doc.sents:
        # if adding this sentence would exceed token limit, start new chunk
        if len((cur + " " + sent.text).split()) > max_tokens:
            chunks.append(cur.strip())
            cur = sent.text
        else:
            cur += " " + sent.text
    if cur:
        chunks.append(cur.strip())
    return chunks

def extract_keyphrases(text: str, top_n: int = 5) -> list[str]:
    kws = kw_model.extract_keywords(
        text,
        keyphrase_ngram_range=(1,2),
        stop_words="english",
        top_n=top_n
    )
    return [kp for kp, score in kws]

# ————————————————
# Audio Extraction & Transcription
# ————————————————
def extract_audio(video_path: str) -> str:
    audio_path = tempfile.mktemp(suffix=".wav")
    try:
        (
            ffmpeg
            .input(video_path)
            .output(audio_path, format="wav", acodec="pcm_s16le", ac=1, ar="16k")
            .run(overwrite_output=True, quiet=True)
        )
        return audio_path
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio extraction error: {e}")

def transcribe_audio(audio_path: str) -> str:
    try:
        model = whisper.load_model("base")
        result = model.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription error: {e}")

# ————————————————
# Question Generation (Valhalla/T5)
# ————————————————
qg_pipeline = pipeline("text2text-generation", model="valhalla/t5-base-e2e-qg")

def generate_questions(text: str, num_questions: int = 5):
    result = qg_pipeline(
        text,
        max_length=256,
        do_sample=True,
        top_k=50,
        num_return_sequences=num_questions
    )
    all_qs = []
    for r in result:
        parts = [q.strip() for q in r["generated_text"].split("<sep>") if q.strip()]
        all_qs.extend(parts)
    # dedupe while preserving order
    seen = set()
    unique = []
    for q in all_qs:
        if q not in seen:
            seen.add(q)
            unique.append(q)
    return unique[:num_questions]

# ————————————————
# MCQ Options & Explanations (Groq LLM)
# ————————————————
def generate_mcq_options_and_explanations(question: str, context: str, retries: int = 3):
    prompt = f"""
Given the transcript:
\"\"\"{context}\"\"\"

Generate one multiple-choice question:

Question: {question}

Return VALID JSON with:
- "question": string
- "options": {{"A":...,"B":...,"C":...,"D":...}}
- "answer": correct letter
- "explanations": {{"A":...,"B":...,"C":...,"D":...}}
"""
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": LLM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 512
    }

    for _ in range(retries):
        try:
            resp = requests.post(GROQ_URL, headers=headers, json=payload)
            resp.raise_for_status()
            content = resp.json()["choices"][0]["message"]["content"]
            mcq = json.loads(content)
            opts = mcq.get("options", {})
            ans  = mcq.get("answer", "")
            expl = mcq.get("explanations", {})
            if len(opts)==4 and ans in opts and len(expl)==4:
                return opts, ans, expl
        except:
            continue
    return generate_fallback_mcq(question, context)

def generate_fallback_mcq(question: str, context: str):
    sents = [s.strip() for s in re.split(r"\.\s*", context) if len(s.strip())>20]
    if len(sents)<4:
        words = context.split()
        sents = [" ".join(words[i:i+5]) for i in range(0, len(words), 5)]
    if len(sents)<4:
        opts = {"A":"N/A","B":"N/A","C":"N/A","D":"N/A"}
    else:
        choices = random.sample(sents,4)
        opts    = dict(zip(["A","B","C","D"], choices))
    correct = random.choice(["A","B","C","D"])
    expl = {
        k: (
            f"Correct: matches “{question}.”"
            if k==correct
            else f"Incorrect: does not answer “{question}.”"
        )
        for k in ["A","B","C","D"]
    }
    return opts, correct, expl

# ————————————————
# Lesson Generation for Ages 9–12
# ————————————————
def generate_lesson(context: str, retries: int = 3) -> str:
    prompt = f"""
Given the story transcript:
\"\"\"{context}\"\"\"

Write 3 simple bullet-point lessons for kids aged 9–12.
Return only bullets, each on its own line.
"""
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": LLM_MODEL,
        "messages": [{"role":"user","content":prompt}],
        "temperature":0.7,
        "max_tokens":200
    }
    for _ in range(retries):
        try:
            r = requests.post(GROQ_URL, headers=headers, json=payload)
            r.raise_for_status()
            text = r.json()["choices"][0]["message"]["content"].strip()
            if text:
                return text
        except:
            continue
    return "- Always speak up if harmed.\n- Kindness helps everyone.\n- Asking for help is brave."

# ————————————————
# API Endpoint
# ————————————————
@app.post("/api/quiz")
async def get_quiz(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        video_path = tmp.name

    try:
        # 1) Extract & transcribe
        audio_path = extract_audio(video_path)
        transcript = transcribe_audio(audio_path)

        # 2) NLP Preprocessing
        summary    = summarize_text(transcript, max_length=300)
        chunks     = chunk_sentences(summary, max_tokens=150)
        # optional: keyphrases = extract_keyphrases(summary, top_n=5)

        # 3) Generate questions per chunk, dedupe, take top 5
        all_qs = []
        for chunk in chunks:
            qs_chunk = generate_questions(chunk, num_questions=2)
            all_qs.extend(qs_chunk)
        seen, qs = set(), []
        for q in all_qs:
            if q not in seen:
                seen.add(q)
                qs.append(q)
            if len(qs) >= 5:
                break

        # 4) Build quiz
        quiz = []
        for q in qs:
            opts, ans, expl = generate_mcq_options_and_explanations(q, summary)
            quiz.append({
                "text":          q,
                "options":       opts,
                "correctAnswer": ans,
                "explanations":  expl
            })

        # 5) Generate lesson bullets
        lesson = generate_lesson(summary)

        return {"questions": quiz, "lesson": lesson}

    finally:
        os.remove(video_path)
        if os.path.exists(audio_path):
            os.remove(audio_path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
