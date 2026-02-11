import os
import requests

HF_API_URL = "https://router.huggingface.co/v1/chat/completions"

HF_TOKEN = os.getenv("HF_TOKEN")

if not HF_TOKEN:
    raise ValueError("HF_TOKEN not set in environment variables.")

HEADERS = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json"
}

def ask_llm(question, context=""):
    payload = {
        "model": "meta-llama/Meta-Llama-3-8B-Instruct",
        "messages": [
            {"role": "user", "content": question}
        ],
        "temperature": 0.6,
        "max_tokens": 300
    }

    response = requests.post(HF_API_URL, headers=HEADERS, json=payload)
    response.raise_for_status()

    return response.json()["choices"][0]["message"]["content"]
