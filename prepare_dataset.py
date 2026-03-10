import pandas as pd

# load dataset
data = pd.read_csv("url_cls.csv")

print("Original rows:", len(data))

# remove empty rows
data = data.dropna()

# ensure label is integer
data["label"] = data["label"].astype(int)

print("Dataset size:", len(data))

# save cleaned dataset
data.to_csv("clean_urls.csv", index=False)

print("Clean dataset saved")