from fastapi import FastAPI, UploadFile, File
from qr_decoder import decode_qr
from analyzer import analyze_qr_data

app = FastAPI(
    title="AI QR Phishing Detector",
    description="Detects Quishing attacks in India",
    version="1.0"
)


@app.post("/scan_qr")
async def scan_qr(file: UploadFile = File(...)):

    image_bytes = await file.read()

    qr_data = decode_qr(image_bytes)

    if not qr_data:
        return {"error": "QR code not detected"}

    return {
        "decoded_data": qr_data
    }


@app.post("/analyze_qr")
async def analyze_qr(data: str):

    result = analyze_qr_data(data)

    return result