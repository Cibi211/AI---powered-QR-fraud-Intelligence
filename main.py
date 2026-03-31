# # from fastapi import FastAPI, UploadFile, File
# # from qr_decoder import decode_qr
# # from analyzer import analyze_qr_data

# # app = FastAPI(
# #     title="AI QR Phishing Detector",
# #     description="Detects Quishing attacks in India",
# #     version="1.0"
# # )


# # @app.post("/scan_qr")
# # async def scan_qr(file: UploadFile = File(...)):

# #     image_bytes = await file.read()

# #     qr_data = decode_qr(image_bytes)

# #     if not qr_data:
# #         return {"error": "QR code not detected"}

# #     return {
# #         "decoded_data": qr_data
# #     }


# # @app.post("/analyze_qr")
# # async def analyze_qr(data: str):

# #     result = analyze_qr_data(data)

# #     return result


# from fastapi import FastAPI, UploadFile, File
# from qr_decoder import decode_qr
# from analyzer import analyze_qr_data
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI(
# #     title="AI QR Phishing Detector",
# #     description="Detects Quishing attacks in India",
# #     version="1.0"
# )
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.post("/scan_and_analyze")
# async def scan_and_analyze(file: UploadFile = File(...)):

#     image_bytes = await file.read()

#     # Step 1: decode QR
#     qr_data = decode_qr(image_bytes)

#     if not qr_data:
#         return {
#             "error": "QR code not detected"
#         }

#     # Step 2: analyze decoded data
#     result = analyze_qr_data(qr_data)

#     # Step 3: return combined response
#     return {
#         "decoded_data": qr_data,
#         "analysis": result
#     }

from fastapi import FastAPI, UploadFile, File, Form
from qr_decoder import decode_qr
from analyzer import analyze_qr_data
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/scan_and_analyze")
async def scan_and_analyze(
    file: UploadFile = File(...),
    language: str = Form("en")   # 🔥 FIX
):
    print("LANG RECEIVED:", language)

    image_bytes = await file.read()

    qr_data = decode_qr(image_bytes)

    if not qr_data:
        return {"error": "QR code not detected"}

    result = analyze_qr_data(qr_data, language)  # 🔥 PASS LANGUAGE

    return {
        "decoded_data": qr_data,
        "analysis": result
    }