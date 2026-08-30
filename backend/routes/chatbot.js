import express from 'express';
import { generateVeterinaryChatResponse } from '../services/geminiService.js';

const router = express.Router();

// POST /api/chatbot/message — Generate AI Veterinary response
router.post('/message', async (req, res) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid text question for the Veterinary Assistant.'
    });
  }

  try {
    const chatResult = await generateVeterinaryChatResponse(message.trim(), history || []);
    return res.status(200).json(chatResult);
  } catch (err) {
    console.error('Veterinary Chatbot error:', err.message);

    const isApiKeyIssue = err.message.includes('GEMINI_API_KEY') || err.message.includes('API key not valid');

    return res.status(isApiKeyIssue ? 401 : 500).json({
      success: false,
      isApiKeyIssue,
      message: isApiKeyIssue
        ? 'Gemini API key is not configured or invalid in backend/.env. Please add your GEMINI_API_KEY from Google AI Studio (https://aistudio.google.com/app/apikey).'
        : "I'm having trouble connecting to the AI veterinary server right now. Please try again in a moment.",
      technicalError: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// GET /api/chatbot/status — Check if Gemini AI is configured
router.get('/status', (req, res) => {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  const isConfigured = !!apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey !== 'YOUR_GEMINI_API_KEY';
  res.json({
    status: 'ok',
    isConfigured,
    model: 'gemini-2.5-flash'
  });
});

export default router;
