from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

app = FastAPI()

model_name = "facebook/nllb-200-distilled-600M"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

class TextRequest(BaseModel):
    text: str

@app.post("/translate")
def translate(request: TextRequest):

    tokenizer.src_lang = "eng_Latn"

    languages = {
        "Tamil": "tam_Taml",
        "Hindi": "hin_Deva",
        "Telugu": "tel_Telu",
        "Kannada": "kan_Knda"
    }

    results = {}

    for name, code in languages.items():
        inputs = tokenizer(request.text, return_tensors="pt", truncation=True)

        output = model.generate(
            **inputs,
            forced_bos_token_id=tokenizer.convert_tokens_to_ids(code),
            max_length=512
        )

        results[name] = tokenizer.decode(output[0], skip_special_tokens=True)

    return results