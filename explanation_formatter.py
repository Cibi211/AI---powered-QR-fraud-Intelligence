def format_explanation(shap_features):

    explanations = []

    for item in shap_features:

        feature = item["feature"]

        if feature == "URL length":
            explanations.append(
                "The link is unusually long, which is common in phishing websites."
            )

        elif feature == "Hyphen count":
            explanations.append(
                "The domain contains many hyphens, a common trick used in fake websites."
            )

        elif feature == "Dot count":
            explanations.append(
                "The URL has many subdomains which can hide malicious websites."
            )

        elif feature == "Digit count":
            explanations.append(
                "The URL contains many numbers which may indicate a suspicious link."
            )

        elif feature == "HTTPS usage":
            explanations.append(
                "The website may not be using secure HTTPS properly."
            )

    return explanations