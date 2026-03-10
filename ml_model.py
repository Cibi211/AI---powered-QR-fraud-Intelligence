# from transformers import pipeline

# classifier = pipeline(
#     "text-classification",
#     model="distilbert-base-uncased-finetuned-sst-2-english"
# )

# def predict_scam(text):

#     try:
#         result = classifier(text)[0]

#         label = result["label"]
#         score = result["score"]

#         if label == "NEGATIVE" and score > 0.8:
#             return True, score

#         return False, score

#     except Exception as e:
#         print("Model error:", e)
#         return False, 0

# Lightweight phishing heuristic model (hackathon friendly)

SUSPICIOUS_WORDS = [
    "verify",
    "urgent",
    "reward",
    "free",
    "gift",
    "login",
    "bank",
    "update",
    "otp"
]

def predict_scam(text):

    text = text.lower()

    score = 0

    for word in SUSPICIOUS_WORDS:
        if word in text:
            score += 1

    confidence = score / len(SUSPICIOUS_WORDS)

    if score >= 2:
        return True, confidence

    return False, confidence