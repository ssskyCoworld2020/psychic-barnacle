const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock AI response (works without API key)
function mockAIResponse(userMessage) {
  const lower = userMessage.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi')) {
    return "Hello there! How can I assist you today?";
  }
  if (lower.includes('how are you')) {
    return "I'm just code, but I'm functioning perfectly. Thanks for asking!";
  }
  if (lower.includes('your name')) {
    return "I'm BlueOne, your personal AI assistant.";
  }
  if (lower.includes('time')) {
    return `The current server time is ${new Date().toLocaleTimeString()}.`;
  }
  if (lower.includes('date')) {
    return `Today's date is ${new Date().toDateString()}.`;
  }
  if (lower.includes('bye') || lower.includes('goodbye')) {
    return "Goodbye! Feel free to chat again anytime.";
  }
  if (lower.includes('thank')) {
    return "You're very welcome!";
  }
  if (lower.includes('joke')) {
    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything!",
      "What do you call a fake noodle? An impasta.",
      "Why did the scarecrow win an award? Because he was outstanding in his field."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  const fallbacks = [
    "That's interesting. Tell me more.",
    "I'm not sure I understand fully, but I'm here to help.",
    "Could you rephrase that? I want to give you the best answer.",
    "I'm listening. Please go on.",
    "Let me think... I don't have a pre‑programmed answer for that, but I'm learning."
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

app.post('/ask', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: 'No message provided.' });
  }
  const reply = mockAIResponse(message);
  res.json({ reply });
});

// Important: Use PORT from environment or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BlueOne backend running on port ${PORT}`);
});