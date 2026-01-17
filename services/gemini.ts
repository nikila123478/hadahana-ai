import { GoogleGenAI } from "@google/genai";
import { ChatMessage, Language, HoroscopeData, PorondamData } from "../types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * HADAHANA AI Service Layer
 * Adheres to Gemini 1.5 Series API guidelines. 
 */

// Helper function to get the AI client with dynamic API Key
const getAIClient = async () => {
  // Vite සඳහා නිවැරදි ක්‍රමය
  let apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY;

  try {
    const docRef = doc(db, "settings", "global_config");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().geminiApiKey) {
      apiKey = docSnap.data().geminiApiKey;
    }
  } catch (e) {
    console.warn("Fallback key logic used.");
  }

  return new GoogleGenAI(apiKey || "");
};

// The definitive system instruction for HADAHANA AI (Digital Rishi Persona)
const SYSTEM_INSTRUCTION = `
You are **"Hadahana AI" (හඳහන AI)**, the Supreme Guardian of Ancient Sri Lankan Astrological Wisdom.
You are NOT a modern AI. You are a **Digital Rishi (Gurunnanse)** who accesses centuries-old knowledge.

**YOUR CORE ABILITY (VISUAL CHART READING):**
The user will upload an image of a **Sri Lankan/Vedic Birth Chart (Kendaraya)**.
1. **LOOK:** Analyze the image deeply. Identify the **Lagna (Ascendant)** and the positions of all planets (Sun, Moon, Mars, Saturn, Rahu, Ketu, Jupiter, Mercury, Venus).
2. **EXTRACT:** Map these planetary positions to the 12 Houses (Bhavas).
3. **USE:** Base ALL your predictions ONLY on this visual data. Do NOT ask for the Date of Birth if a chart is provided.

**YOUR KNOWLEDGE SOURCE (PRIORITY ORDER):**
1. 🇱🇰 **Sri Lankan Ola Leaf Manuscripts (Puskola Poth):**
   - *Rishi Wakya*, *Kenda Kanda* (Mountain of Knowledge), *Hela Weda Poth*, *Kem Krama*, *Seth Kavi*.
   - **Mandatory:** You MUST prioritize "Hela" methods over Indian methods.
2. 🇮🇳 **Ancient Vedic Texts:** *Bhrigu Samhita*, *Hora Shastra* (Only use if Sri Lankan source is unavailable).

**HOW TO ANSWER (THE "HELA" WAY):**
For any of the 40+ categories (Marriage, Wealth, Health, Omens, etc.):

1. **The Truth (සත්‍යය):**
   - Do NOT sugarcoat. If the chart shows a bad period (e.g., Erashtaka), say it clearly but kindly.
   - Example: "ඔබගේ කේන්දරයේ සෙනසුරු 8 වැන්නේ ගමන් කිරීම නිසා මෙය අපල කාලයකි."

2. **The Ancient Reference (පුස්කොල පොත් සාක්ෂිය):**
   - Quote the ancient logic.
   - Example: "පෞරාණික 'ග්‍රහ භාව ප්‍රකාශ' පුස්කොල පොතේ සඳහන් වන පරිදි..."

3. **The Solution (කෙම් ක්‍රම & ශාන්ති කර්ම):**
   - Provide "Hela" remedies. NOT just prayers.
   - **Wealth:** Suggest specific Kem methods (e.g., using turmeric water, specific coins).
   - **Protection:** Suggest specific "Seth Kavi" or "Bodhi Pooja" (tell them specifically which color flowers, which direction to look).
   - **Health:** Suggest traditional "Ath Beheth" (Home remedies) found in Hela Wedakama.

**STRICT RULES:**
- **Language:** Dignified, Mystical Sinhala (use terms like 'ඔබ තුමා/තුමිය', 'ග්‍රහ දෝෂ', 'නැකැත්').
- **No Hallucinations:** If the chart image is too blurry to read, politely ask them to upload a clearer photo. Do NOT guess.
- **Scope:** You cover EVERYTHING: Porondam, Vastu, Lizard Omens, Dreams, Palmistry (if hand photo given), and Gemstones.
- **Response Format:** You must output your response in VALID HTML using the specified structure (<div class="response-card">...).

"මම හුදෙක් පරිගණක වැඩසටහනක් නොව, හෙළ බොදු අස්වැද්දුමෙන් පෝෂණය වූ ඩිජිටල් ගුරුන්නාන්සේ කෙනෙකි."
`;

const MODEL_NAME = "gemini-1.5-flash";

/**
 * Advanced chat analysis handling text, multi-images, and history.
 */
export const analyzeHoroscopeAdvanced = async (
  images: string[],
  userMessage: string,
  history: ChatMessage[],
  outputLang: Language
): Promise<string> => {
  const genAI = await getAIClient();
  const model = genAI.getGenerativeModel({ 
    model: MODEL_NAME,
    systemInstruction: SYSTEM_INSTRUCTION 
  });

  // Prepare history for chat format
  const chatHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [
      { text: msg.text },
      ...(msg.images || []).map(img => ({
        inlineData: {
          mimeType: 'image/jpeg',
          data: img.split(',')[1],
        },
      }))
    ]
  }));

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      temperature: 0.5,
      topP: 0.95,
      topK: 40,
    },
  });

  const langInstruction = outputLang === 'si' 
    ? "භාෂාව: කරුණාකර 'පිරිසිදු සිංහල' භාෂාවෙන් (Formal Sinhala) පිළිතුරු දෙන්න." 
    : "Language: Please respond in English, but maintain the highly respectful, spiritual, and professional 'Guru' tone.";

  const now = new Date();
  const dateString = now.toLocaleDateString('si-LK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeString = now.toLocaleTimeString('si-LK');
  const systemContext = `[SYSTEM_DATA]: CURRENT_DATE = ${dateString}, CURRENT_TIME = ${timeString}`;

  const currentMessageParts: any[] = [
    { text: `${systemContext}\n\n${langInstruction}\n\nපරිශීලකයාගේ වත්මන් පණිවිඩය: ${userMessage}` }
  ];

  if (images.length > 0) {
    images.forEach(img => {
      currentMessageParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: img.split(',')[1],
        },
      });
    });
  }

  const result = await chat.sendMessage(currentMessageParts);
  const response = await result.response;
  let cleanText = response.text();

  return cleanText.replace(/```html/g, '').replace(/```/g, '');
};

export const getHoroscopeReading = async (data: HoroscopeData, lang: Language): Promise<string> => {
  const genAI = await getAIClient();
  const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: SYSTEM_INSTRUCTION });
  
  const langInstruction = lang === 'si' ? "Sinhala" : "English";
  const prompt = `Language: ${langInstruction}\n\nPerform a full horoscope reading based on:\nDOB: ${data.dob}\nTime: ${data.tob}\nPlace: ${data.pob}\n\nIMPORTANT: Respond in valid HTML using the specified classes.`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().replace(/```html/g, '').replace(/```/g, '');
};

export const getPorondamReading = async (data: PorondamData, lang: Language): Promise<string> => {
  const genAI = await getAIClient();
  const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: SYSTEM_INSTRUCTION });
  
  const langInstruction = lang === 'si' ? "Sinhala" : "English";
  const prompt = `Language: ${langInstruction}\n\nCheck Porondam compatibility for:\nGroom: ${data.groomName} (${data.groomNakshatra})\nBride: ${data.brideName} (${data.brideNakshatra})\n\nIMPORTANT: Respond in valid HTML using the specified classes.`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().replace(/```html/g, '').replace(/```/g, '');
};

export const analyzeAncientManuscript = async (image: string, lang: Language): Promise<string> => {
  const genAI = await getAIClient();
  const model = genAI.getGenerativeModel({ model: MODEL_NAME, systemInstruction: SYSTEM_INSTRUCTION });
  
  const langInstruction = lang === 'si' ? "Sinhala" : "English";
  const prompt = `Language: ${langInstruction}\n\nAnalyze this manuscript.\nIMPORTANT: Respond in valid HTML using the specified classes.`;
  
  const result = await model.generateContent([
    { inlineData: { mimeType: 'image/jpeg', data: image.split(',')[1] } },
    { text: prompt }
  ]);
  
  const response = await result.response;
  return response.text().replace(/```html/g, '').replace(/```/g, '');
};
