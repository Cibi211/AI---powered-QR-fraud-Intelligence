POPULAR_BRANDS = [
    "paypal",
    "google",
    "amazon",
    "facebook",
    "microsoft",
    "apple",
    "instagram",
    "whatsapp",
    "sbi",
    "hdfc",
    "icici",
    "axis"
]


def normalize_domain(domain):

    return (
        domain.lower()
        .replace("0", "o")
        .replace("1", "l")
        .replace("I", "l")
        .replace("rn", "m")
    )


def levenshtein_distance(a, b):

    if len(a) < len(b):
        return levenshtein_distance(b, a)

    if len(b) == 0:
        return len(a)

    previous_row = range(len(b) + 1)

    for i, c1 in enumerate(a):

        current_row = [i + 1]

        for j, c2 in enumerate(b):

            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)

            current_row.append(min(insertions, deletions, substitutions))

        previous_row = current_row

    return previous_row[-1]


def detect_typosquatting(domain):

    domain = normalize_domain(domain)

    for brand in POPULAR_BRANDS:

        distance = levenshtein_distance(domain, brand)

        if distance <= 2:
            return True, f"Domain impersonates '{brand}' (possible phishing)"

    return False, None