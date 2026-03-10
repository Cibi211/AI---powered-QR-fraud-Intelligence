import shap
import joblib
from feature_extractor import extract_features

model = joblib.load("phishing_model.pkl")

explainer = shap.TreeExplainer(model)

FEATURE_NAMES = [
    "URL length",
    "Dot count",
    "Hyphen count",
    "Digit count",
    "HTTPS usage"
]


def explain_prediction(url):

    features = extract_features(url)

    shap_values = explainer.shap_values([features])

    contributions = []

    for name, value in zip(FEATURE_NAMES, shap_values[0]):

        contributions.append({
            "feature": name,
            "impact": float(value)
        })

    contributions = sorted(
        contributions,
        key=lambda x: abs(x["impact"]),
        reverse=True
    )

    return contributions[:3]