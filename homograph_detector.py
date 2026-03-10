from urllib.parse import urlparse

def detect_homograph(data):

    brands = [
        "paypal",
        "google",
        "amazon",
        "apple",
        "facebook",
        "paytm",
        "gpay",
        "phonepe"
    ]

    domain = urlparse(data).netloc.lower()

    normalized = (
        domain.replace("0", "o")
        .replace("1", "l")
        .replace("3", "e")
        .replace("I", "l")
    )

    for brand in brands:

        # classic homograph attack
        if brand in normalized and brand not in domain:
            return True, f"Homograph attack detected impersonating '{brand}'"

        # brand + suspicious suffix
        if brand in domain and domain != f"{brand}.com":
            if "-" in domain:
                return True, f"Suspicious domain impersonating '{brand}'"

    return False, ""