import cv2
import numpy as np

def decode_qr(image_bytes):

    npimg = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    detector = cv2.QRCodeDetector()

    data, bbox, _ = detector.detectAndDecode(img)

    if data:
        return data

    return None