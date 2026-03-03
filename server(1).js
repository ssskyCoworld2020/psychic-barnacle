const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini with your API key (store it securely!)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Optional: simple memory (stores last 5 exchanges)
let conversationHistory = [];

app.post('/ask', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: 'No message provided.' });
  }

  try {
    // Add user message to history
    conversationHistory.push({ role: 'user', content: message });
    // Keep only last 10 messages to avoid token limits
    if (conversationHistory.length > 10) conversationHistory.shift();

    // Build prompt with history for context
    let prompt = '';
    conversationHistory.forEach(entry => {
      prompt += `${entry.role === 'user' ? 'User' : 'Assistant'}: ${entry.content}\n`;
    });
    prompt += 'Assistant: ';

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    // Add assistant reply to history
    conversationHistory.push({ role: 'assistant', content: reply });

    res.json({ reply });
  } catch (error) {
    console.error('Gemini error:', error);
    // Fallback to mock AI if Gemini fails
    const fallbackReply = mockAIResponse(message);
    res.json({ reply: fallbackReply });
  }
});

// Mock AI function as backup (optional)
function mockAIResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  if (lower.includes('hello')) return "Hello! (fallback mode)";
  // ... (you can copy your full mock function here)
  return "I'm running in fallback mode.";
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BlueOne backend with Gemini running on port ${PORT}`);
});