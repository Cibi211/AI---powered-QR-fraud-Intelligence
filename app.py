# from fastapi import FastAPI
# from pydantic import BaseModel
# from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# app = FastAPI()

# model_name = "facebook/nllb-200-distilled-600M"
# tokenizer = AutoTokenizer.from_pretrained(model_name)
# model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# class TextRequest(BaseModel):
#     text: str

# @app.post("/translate")
# def translate(request: TextRequest):

#     tokenizer.src_lang = "eng_Latn"

#     languages = {
#         "Tamil": "tam_Taml",
#         "Hindi": "hin_Deva",
#         "Telugu": "tel_Telu",
#         "Kannada": "kan_Knda"
#     }

#     results = {}

#     for name, code in languages.items():
#         inputs = tokenizer(request.text, return_tensors="pt", truncation=True)

#         output = model.generate(
#             **inputs,
#             forced_bos_token_id=tokenizer.convert_tokens_to_ids(code),
#             max_length=512

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

import sys
import os

# 🔥 CONNECT analyzer.py
sys.path.append(os.path.abspath("../python/ai"))

from analyzer import analyze_qr_data

import cv2
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def decode_qr(image_bytes):
    npimg = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    detector = cv2.QRCodeDetector()
    data, _, _ = detector.detectAndDecode(img)

    return data


@app.post("/scan_and_analyze")
async def scan_and_analyze(
    file: UploadFile = File(...),
    language: str = Form("en")
):
    print("LANG RECEIVED:", language)

    image_bytes = await file.read()

    qr_data = decode_qr(image_bytes)

    if not qr_data:
        return {"error": "QR code not detected"}

    # 🔥 CALL analyzer
    result = analyze_qr_data(qr_data, language)

    return {
        "decoded_data": qr_data,
        "analysis": result
    }
    print("LANG:", language)

