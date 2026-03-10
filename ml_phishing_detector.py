import joblib
from feature_extractor import extract_features
from shap_explainer import explain_prediction
from explanation_formatter import format_explanation

model = joblib.load("phishing_model.pkl")

def predict_phishing(url):

    features = extract_features(url)

    pred = model.predict([features])[0]
    prob = model.predict_proba([features])[0][1]

    shap_features = explain_prediction(url)

    human_explanations = format_explanation(shap_features)

    return pred == 1, prob, human_explanations