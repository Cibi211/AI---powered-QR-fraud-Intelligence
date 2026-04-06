# import tldextract
# from homograph_detector import detect_homograph
# from phishing_detector import detect_phishing
# from upi_detector import detect_upi_scam
# from domain_similarity import detect_typosquatting
# from ml_phishing_detector import predict_phishing
# from payment_qr_detector import detect_fake_payment_qr
# from deep_translator import GoogleTranslator

# # --------------------------
# # Translation Functions
# # --------------------------

# def translate_text(text, lang):

#     lang_map = {
#         "en": "en",
#         "ta": "ta",
#         "tamil": "ta",
#         "hi": "hi",
#         "hindi": "hi"
#     }

#     target = lang_map.get(lang.lower(), "en")

#     if target == "en":
#         return text

#     try:
#         translated = GoogleTranslator(source="auto", target=target).translate(text)
#         return translated
#     except Exception as e:
#         print("Translation error:", e)
#         return text


# def translate_response(result, lang):

#     for exp in result["explanations"]:
#         exp["reason"] = translate_text(exp["reason"], lang)
#         exp["module"] = translate_text(exp["module"], lang)

#     risk_map = {
#         "ta": {
#             "HIGH": "அதிக அபாயம்",
#             "MEDIUM": "மிதமான அபாயம்",
#             "LOW": "குறைந்த அபாயம்"
#         },
#         "hi": {
#             "HIGH": "उच्च जोखिम",
#             "MEDIUM": "मध्यम जोखिम",
#             "LOW": "कम जोखिम"
#         }
#     }
#     if "feature_importance" in exp:
#             exp["feature_importance"] = [
#                 translate_text(f, lang) for f in exp["feature_importance"]
#             ]

#     key = lang.lower()

#     if key in risk_map:
#         result["risk_level"] = risk_map[key].get(
#             result["risk_level"], result["risk_level"]
#         )

#     return result


# def analyze_qr_data(data, language="en"):
#     print("LANG IN ANALYZER:", language)

#     risk_score = 0
#     explanations = []

#     # --------------------------
#     # Clean input
#     # --------------------------
#     data = data.strip()

#     if not data.startswith(("http://", "https://", "upi://")):
#         data = "http://" + data

#     ext = tldextract.extract(data)
#     domain = ext.domain + "." + ext.suffix

#     # --------------------------
#     # Homograph detection
#     # --------------------------
#     flag, reason = detect_homograph(data)

#     if flag:
#         risk_score += 50
#         explanations.append({
#             "module": "Homograph Detector",
#             "reason": reason
#         })

#     # --------------------------
#     # Typosquatting detection
#     # --------------------------
#     flag, reason = detect_typosquatting(domain)

#     if flag:
#         risk_score += 40
#         explanations.append({
#             "module": "Typosquatting Detector",
#             "reason": reason
#         })

#     # --------------------------
#     # Shortened URL detection
#     # --------------------------
#     SHORT_DOMAINS = ["bit.ly", "tinyurl.com", "t.co"]

#     for short in SHORT_DOMAINS:
#         if short in data:
#             risk_score += 40
#             explanations.append({
#                 "module": "URL Shortener Detector",
#                 "reason": "Shortened URL detected (common phishing technique)"
#             })

#     # --------------------------
#     # UPI scam detection
#     # --------------------------
#     flag, reasons = detect_upi_scam(data)

#     if flag:
#         risk_score += 40
#         for r in reasons:
#             explanations.append({
#                 "module": "UPI Scam Detector",
#                 "reason": r
#             })

#     # --------------------------
#     # Fake payment QR detection
#     # --------------------------
#     flag, reasons = detect_fake_payment_qr(data)

#     if flag:
#         risk_score += 50
#         for r in reasons:
#             explanations.append({
#                 "module": "Payment QR Detector",
#                 "reason": r
#             })

#     # --------------------------
#     # HTTP security check
#     # --------------------------
#     if data.startswith("http://"):
#         risk_score += 10
#         explanations.append({
#             "module": "Security Check",
#             "reason": "URL uses insecure HTTP"
#         })

    

#     # --------------------------
#     # Phishing feature detection
#     # --------------------------
#     score, reasons = detect_phishing(data)

#     risk_score += score

#     for r in reasons:
#         explanations.append({
#             "module": "Phishing Feature Detector",
#             "reason": r
#         })

   
#     ml_flag, prob, shap_exp = predict_phishing(data)

#     if ml_flag:

#         risk_score += 30
        

#         explanations.append({
#             "module": "ML Phishing Model",
#             "reason": f"Predicted phishing with probability {prob:.2f}",
#             "feature_importance": shap_exp
#         })

#     # --------------------------
#     # Final risk calculation
#     # --------------------------
#     risk_score = min(risk_score, 100)

#     if risk_score >= 70:
#         level = "HIGH"
#     elif risk_score >= 40:
#         level = "MEDIUM"
#     else:
#         level = "LOW"

#     result = {
#     "risk_score": risk_score,
#     "risk_level": level,
#     "explanations": explanations
# }

# # 🔥 APPLY TRANSLATION HERE
#     result = translate_response(result, language)

#     return result

import tldextract
from homograph_detector import detect_homograph
from phishing_detector import detect_phishing
from upi_detector import detect_upi_scam
from domain_similarity import detect_typosquatting
from ml_phishing_detector import predict_phishing
from payment_qr_detector import detect_fake_payment_qr
from deep_translator import GoogleTranslator

# --------------------------
# Translation Functions
# --------------------------

def translate_text(text, lang):

    # lang_map = {
    #     "en": "en",
    #     "ta": "ta",
    #     "tamil": "ta",
    #     "hi": "hi",
    #     "hindi": "hi"
    # }
    lang_map = {
        "en": "en",
        "ta": "ta",
        "hi": "hi",
        "te": "te",   # Telugu
        "kn": "kn",   # Kannada
        "ml": "ml"    # Malayalam
    }

    target = lang_map.get(lang.lower(), "en")

    if target == "en":
        return text

    try:
        translated = GoogleTranslator(source="auto", target=target).translate(text)
        return translated
    except Exception as e:
        print("Translation error:", e)
        return text


def translate_response(result, lang):

    for exp in result["explanations"]:
        exp["reason"] = translate_text(exp["reason"], lang)
        exp["module"] = translate_text(exp["module"], lang)

        if "feature_importance" in exp:
            exp["feature_importance"] = [
                translate_text(f, lang) for f in exp["feature_importance"]
    ]

    risk_map = {
        
            "ta": {
                "HIGH": "அதிக அபாயம்",
                "MEDIUM": "மிதமான அபாயம்",
                "LOW": "குறைந்த அபாயம்"
            },
            "hi": {
                "HIGH": "उच्च जोखिम",
                "MEDIUM": "मध्यम जोखिम",
                "LOW": "कम जोखिम"
            },
            "te": {
                "HIGH": "అధిక ప్రమాదం",
                "MEDIUM": "మధ్యస్థ ప్రమాదం",
                "LOW": "తక్కువ ప్రమాదం"
            },
            "kn": {
                "HIGH": "ಹೆಚ್ಚಿನ ಅಪಾಯ",
                "MEDIUM": "ಮಧ್ಯಮ ಅಪಾಯ",
                "LOW": "ಕಡಿಮೆ ಅಪಾಯ"
            },
            "ml": {
                "HIGH": "ഉയർന്ന അപകടം",
                "MEDIUM": "മിതമായ അപകടം",
                "LOW": "കുറഞ്ഞ അപകടം"
            }

        }
    # if "feature_importance" in exp:
    #         exp["feature_importance"] = [
    #             translate_text(f, lang) for f in exp["feature_importance"]
    #         ]

    key = lang.lower()

    if key in risk_map:
        result["risk_level"] = risk_map[key].get(
            result["risk_level"], result["risk_level"]
        )

    return result


def analyze_qr_data(data, language="en"):
    print("LANG IN ANALYZER:", language)
    

    risk_score = 0
    explanations = []

    # --------------------------
    # Clean input
    # --------------------------
    data = data.strip()

    if not data.startswith(("http://", "https://", "upi://")):
        data = "http://" + data

    # ext = tldextract.extract(data)
    # domain = ext.domain + "." + ext.suffix
    ext = tldextract.extract(data)
    domain = ext.domain + "." + ext.suffix

    # --------------------------
    # 🔥 ADD HERE (IMPORTANT)
    # Suspicious domain heuristic
    # --------------------------
    SUSPICIOUS_WORDS = [
        "login", "secure", "verify", "account", "update",
        "bank", "payment", "free", "offer", "win"
    ]

    matches = sum(word in data.lower() for word in SUSPICIOUS_WORDS)

    risk_score += matches * 10   # each keyword adds score

    if matches > 0:
        explanations.append({
            "module": "Heuristic Detector",
            "reason": f"{matches} suspicious keyword(s) found in URL"
        })

    # --------------------------
    # 🔥 ADD HERE
    # Unknown domain risk
    # --------------------------
    TRUSTED_DOMAINS = [
        "google.com", "youtube.com", "amazon.in",
        "microsoft.com", "apple.com", "github.com"
    ]

    if domain not in TRUSTED_DOMAINS:
        domain_length = len(domain)

        if domain_length > 15:
            risk_score += 15
        elif domain_length > 10:
            risk_score += 10
        else:
            risk_score += 5

        explanations.append({
            "module": "Domain Analysis",
            "reason": f"Domain length is {domain_length}, which may indicate risk"
        })

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
        risk_score += 20
        explanations.append({
            "module": "Security Check",
            "reason": "URL uses insecure HTTP"
        })

    # --------------------------
# URL complexity
# --------------------------
    url_length = len(data)

    if url_length > 75:
        risk_score += 15
    elif url_length > 50:
        risk_score += 10
    elif url_length > 30:
        risk_score += 5

    

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

   
    ml_flag, prob, shap_exp = predict_phishing(data)


# Dynamic scoring instead of fixed 30
    ml_score = int(prob * 25)
    risk_score += ml_score

    # 🔥 prevent normal URLs becoming HIGH
    if prob < 0.6:
        risk_score -= 30

    if prob > 0.4:
        explanations.append({
            "module": "ML Phishing Model",
            "reason": f"Predicted phishing with probability {prob:.2f}",
            "feature_importance": shap_exp
    })
        
    print("FINAL SCORE:", risk_score)
    print("EXPLANATIONS:", explanations)

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

    result = {
    "risk_score": risk_score,
    "risk_level": level,
    "explanations": explanations
}

# 🔥 APPLY TRANSLATION HERE
    result = translate_response(result, language)

    return result