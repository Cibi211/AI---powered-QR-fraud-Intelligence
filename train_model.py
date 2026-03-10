import pandas as pd
from xgboost import XGBClassifier
import joblib

from feature_extractor import extract_features


data = pd.read_csv("url_cls.csv")

X = []
y = []

for _, row in data.iterrows():

    features = extract_features(row["url"])

    X.append(features)

    y.append(row["label"])

model = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1
)

model.fit(X, y)

joblib.dump(model, "phishing_model.pkl")

print("Model trained successfully")