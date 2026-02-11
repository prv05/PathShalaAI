let recognition;
let lastAnswer = "";

// =====================================
// 🧠 Ask AI (Sidebar Only)
// =====================================

async function askDoubt() {
  const question = document.getElementById("questionInput").value.trim();
  if (!question) return;

  try {
    const res = await fetch("http://127.0.0.1:5000/api/ask-rag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: question })
    });

    if (!res.ok) {
      throw new Error("Server error");
    }

    const data = await res.json();

    lastAnswer = data.answer_text || "No response from AI.";

    document.getElementById("aiText").innerText = lastAnswer;

    // ✅ Enable Listen button after answer
    document.getElementById("listenBtn").disabled = false;

  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("aiText").innerText =
      "⚠️ Unable to connect to AI server.";

    // Keep Listen disabled if error
    document.getElementById("listenBtn").disabled = true;
  }
}

// =====================================
// 🎤 Speech to Text
// =====================================

function startListening() {
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    alert("Speech recognition not supported in this browser.");
    return;
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.start();

  recognition.onresult = function (event) {
    const spokenText = event.results[0][0].transcript;
    document.getElementById("questionInput").value = spokenText;
    askDoubt();
  };

  recognition.onerror = function (event) {
    console.error("Speech recognition error:", event.error);
  };
}

// =====================================
// 🔊 Browser Text to Speech
// =====================================

// Load voices properly (important for Chrome)
window.speechSynthesis.onvoiceschanged = function () {
  window.speechSynthesis.getVoices();
};

function playVoice() {
  if (!lastAnswer) {
    console.log("No text to speak.");
    return;
  }

  // Stop any previous speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(lastAnswer);

  // Try selecting English voice
  const voices = window.speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang.includes("en"));

  if (englishVoice) {
    utterance.voice = englishVoice;
  }

  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}
