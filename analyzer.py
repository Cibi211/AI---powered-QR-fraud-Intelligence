import tldextract
from homograph_detector import detect_homograph
from phishing_detector import detect_phishing
from upi_detector import detect_upi_scam
from domain_similarity import detect_typosquatting
from ml_phishing_detector import predict_phishing
from payment_qr_detector import detect_fake_payment_qr


def analyze_qr_data(data):

    risk_score = 0
    explanations = []

    # --------------------------
    # Clean input
    # --------------------------
    data = data.strip()

    if not data.startswith(("http://", "https://", "upi://")):
        data = "http://" + data

    ext = tldextract.extract(data)
    domain = ext.domain + "." + ext.suffix

    # --------------------------
    # Homograph detection
    # --------------------------
    flag, reason = detect_homograph(data)

    if flag:
        risk_score += 50
        explanations.append({
            "module": "Homograph Detector",
            "reason": reason
        })

    # --------------------------
    # Typosquatting detection
    # --------------------------
    flag, reason = detect_typosquatting(domain)

    if flag:
        risk_score += 40
        explanations.append({
            "module": "Typosquatting Detector",
            "reason": reason
        })

    # --------------------------
    # Shortened URL detection
    # --------------------------
    SHORT_DOMAINS = ["bit.ly", "tinyurl.com", "t.co"]

    for short in SHORT_DOMAINS:
        if short in data:
            risk_score += 40
            explanations.append({
                "module": "URL Shortener Detector",
                "reason": "Shortened URL detected (common phishing technique)"
            })

    # --------------------------
    # UPI scam detection
    # --------------------------
    flag, reasons = detect_upi_scam(data)

    if flag:
        risk_score += 40
        for r in reasons:
            explanations.append({
                "module": "UPI Scam Detector",
                "reason": r
            })

    # --------------------------
    # Fake payment QR detection
    # --------------------------
    flag, reasons = detect_fake_payment_qr(data)

    if flag:
        risk_score += 50
        for r in reasons:
            explanations.append({
                "module": "Payment QR Detector",
                "reason": r
            })

    # --------------------------
    # HTTP security check
    # --------------------------
    if data.startswith("http://"):
        risk_score += 10
        explanations.append({
            "module": "Security Check",
            "reason": "URL uses insecure HTTP"
        })

    # --------------------------
    # Phishing feature detection
    # --------------------------
    score, reasons = detect_phishing(data)

    risk_score += score

    for r in reasons:
        explanations.append({
            "module": "Phishing Feature Detector",
            "reason": r
        })

    # --------------------------
    # ML phishing detection
    # --------------------------
    # ml_flag, prob = predict_phishing(data)

    # if ml_flag:
    #     risk_score += 30
    #     explanations.append({
    #         "module": "ML Phishing Model",
    #         "reason": f"Model predicted phishing with probability {prob:.2f}"
    #     })
    ml_flag, prob, shap_exp = predict_phishing(data)

    if ml_flag:

        risk_score += 30
        

        explanations.append({
            "module": "ML Phishing Model",
            "reason": f"Predicted phishing with probability {prob:.2f}",
            "feature_importance": shap_exp
        })

    # --------------------------
    # Final risk calculation
    # --------------------------
    risk_score = min(risk_score, 100)

    if risk_score >= 70:
        level = "HIGH"
    elif risk_score >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "risk_score": risk_score,
        "risk_level": level,
        "explanations": explanations
    }