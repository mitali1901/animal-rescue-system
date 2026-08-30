import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const VETERINARY_SYSTEM_INSTRUCTION = `You are PawsCare Veterinary Assistant, an AI assistant focused on animal health, veterinary education, first-aid guidance, and responsible pet care.

You can answer questions about:
- Dogs, Cats, Birds, Rabbits, Puppies, Kittens, and Common domestic animals
- Basic animal health, nutrition, diet safety, hygiene, vaccination schedules, and parasite prevention
- Common symptoms, basic first aid, post-injury care, and general preventive care
- When professional veterinary attention is needed

Important Guidelines:
1. Role & Medical Limitations:
   - You are an educational AI assistant, not a licensed veterinarian.
   - Do not claim to be a licensed veterinarian or make a definitive medical diagnosis.
   - Do not prescribe prescription medication, calculate medication dosages, or recommend giving human medications (like Ibuprofen, Paracetamol/Tylenol, Aspirin) to animals, as many are toxic or fatal to pets.

2. Emergency Triage (CRITICAL):
   - If the user describes emergency symptoms (difficulty breathing, severe bleeding, unconsciousness, seizures, suspected poisoning, severe trauma/hit by car, inability to stand, severe burns, choking, severe allergic reaction, bloated/distended abdomen with distress, continuous vomiting with severe weakness, sudden collapse, or extreme pain), IMMEDIATELY state that this is a potential medical emergency and urge them to contact an emergency veterinary hospital or clinic right away at the very top of your response.

3. Cure Injured Stray Animal Integration:
   - If the user mentions finding an injured or sick stray animal on the street or in public, provide immediate safe handling/first-aid tips and guide them to use PawsCare's "Cure Animals → Cure Injured Animal" feature (/rescue) to submit location details, upload photos, and dispatch volunteer rescue ambulances.

4. Clear Response Formatting:
   When helpful for health questions, organize your response with clear sections using Markdown:
   ### 🩺 What might be happening
   ### ⚠️ Warning signs
   ### 🏠 Safe home care & first aid
   ### 🏥 When to see a veterinarian
   ### 🐾 Important notice
   (For simple or conversational questions, answer naturally and warmly).

5. Follow-up Questions:
   - If the user provides vague symptoms, ask relevant follow-up questions (e.g. species, breed, age, duration, eating/drinking behavior, energy level) to provide more accurate educational information.

Always be compassionate, clear, supportive, and prioritize animal safety above all.`;

/**
 * Generate a veterinary chat response using Gemini API
 * @param {string} userMessage - Latest user query
 * @param {Array} history - Previous conversation messages
 */
export async function generateVeterinaryChatResponse(userMessage, history = []) {
  dotenv.config();

  const apiKey = (process.env.GEMINI_API_KEY || '').trim();

  if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey === 'YOUR_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured in backend/.env. Please obtain a free API key from Google AI Studio (https://aistudio.google.com/app/apikey).');
  }

  const ai = new GoogleGenAI({ apiKey });

  // Format conversation history for Gemini multi-turn chat
  const contents = [];

  if (Array.isArray(history) && history.length > 0) {
    for (const msg of history) {
      const role = msg.role === 'user' ? 'user' : 'model';
      const text = typeof msg.content === 'string' ? msg.content : (msg.text || '');
      if (text) {
        contents.push({
          role,
          parts: [{ text }]
        });
      }
    }
  }

  // Add the current user query
  contents.push({
    role: 'user',
    parts: [{ text: userMessage }]
  });

  const modelsToTry = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3-flash-preview'];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: VETERINARY_SYSTEM_INSTRUCTION,
          temperature: 0.4,
          maxOutputTokens: 4096
        }
      });

      const replyText = response.text || (response.candidates?.[0]?.content?.parts?.[0]?.text) || 'I am here to assist with your pet care questions.';

      // Check if emergency keywords triggered for emergency badge
      const emergencyKeywords = ['emergency vet', 'immediate veterinary', 'emergency animal hospital', 'life-threatening', 'poison control', 'urgent medical attention', 'immediate medical attention'];
      const isEmergency = emergencyKeywords.some(kw => replyText.toLowerCase().includes(kw));

      return {
        success: true,
        reply: replyText,
        isEmergency,
        modelUsed: model
      };
    } catch (err) {
      console.warn(`Attempt with model ${model} failed (${err.message}). Trying fallback model...`);
      lastError = err;
    }
  }

  console.error('❌ All Gemini model attempts failed:', lastError);
  throw new Error(lastError ? lastError.message : 'Failed to generate response from Gemini API.');
}
