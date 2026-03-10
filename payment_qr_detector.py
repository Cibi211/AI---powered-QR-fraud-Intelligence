
import urllib.parse

SUSPICIOUS_WORDS = [
    "reward",
    "bonus",
    "refund",
    "gift",
    "lottery",
    "cashback",
    "claim"
]

PAYMENT_APPS = [
    "paytm",
    "gpay",
    "phonepe"
]


def detect_fake_payment_qr(data):

    if not data.startswith("upi://"):
        return False, []

    parsed = urllib.parse.urlparse(data)

    params = urllib.parse.parse_qs(parsed.query)

    reasons = []

    # merchant name
    if "pn" in params:

        name = params["pn"][0].lower()

        for word in SUSPICIOUS_WORDS:

            if word in name:

                reasons.append(
                    "Suspicious reward keyword in payment request"
                )

    # payment amount
    if "am" in params:

        try:

            amount = float(params["am"][0])

            if amount > 2000:

                reasons.append("High payment request detected")

        except:
            pass

    # suspicious UPI ID
    if "pa" in params:

        upi_id = params["pa"][0]

        if "@" not in upi_id:

            reasons.append("Invalid UPI ID format")

    if reasons:
        return True, reasons

    return False, []