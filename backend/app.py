from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from llm_client import ask_llm
from tts import text_to_speech

app = Flask(__name__)

CORS(
    app,
    resources={r"/api/*": {"origins": ["http://127.0.0.1:5500", "http://localhost:5500"]}},
    supports_credentials=True
)


@app.route("/api/ask-rag", methods=["POST"])
def ask_rag():
    data = request.json
    question = data["question"]

    answer_text = ask_llm(question)

    return jsonify({
        "answer_text": answer_text
    })


@app.route("/api/tts", methods=["POST"])
def tts():
    text = request.json["text"]
    audio_path = text_to_speech(text)

    filename = os.path.basename(audio_path)

    return jsonify({
        "audio_url": f"http://127.0.0.1:5000/audio/{filename}"
    })

@app.route("/audio/<filename>")
def get_audio(filename):
    return send_file(
        f"audio/{filename}",
        mimetype="audio/mpeg",
        as_attachment=False
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
