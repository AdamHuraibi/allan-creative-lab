import { GoogleGenAI, Type } from '@google/genai';
import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const { topic, modeContext } = req.body;

        const modePrompt = modeContext ? `
You MUST strictly follow this visual identity mode constraint:
- Mode Name: ${modeContext.name}
- Visual Direction: ${modeContext.direction.visual}
- Typography: ${modeContext.direction.typography}
- Background Concept: ${modeContext.direction.background}
- Content Tone: ${modeContext.direction.tone}
- Brand Colors Allowed: ${modeContext.colors.join(', ')}

Please choose the themeColor and text fills using ONLY the allowed brand colors or variations of them.
The text style, tone, and mood should match the specified visual direction exactly.
` : `
Use authentic, rich Yemeni themes, e.g. agriculture, heritage, coffee, architecture.
Keep text concise and impactful. Use brand colors loosely (deep green #1E4D2B, earth brown #8A6E5D, harvest gold #E4A201, warm orange #D6613F, ivory #F8F4EA, dark navy #3F4755).
`;

        const prompt = `You are a design assistant for a Yemeni cultural application called "Allan".
Generate raw content and styling parameters for a poster about: "${topic}".
Output MUST be in strict JSON format matching this structure:
{
  "themeColor": "#HEXCODE",
  "texts": [
    { "text": "MAIN TITLE (Arabic)", "fontSize": 100, "y": 80, "fill": "#HEXCODE" },
    { "text": "Subtitle (Arabic)", "fontSize": 40, "y": 220, "fill": "#HEXCODE" },
    { "text": "Short descriptive sentence or footer", "fontSize": 30, "y": 900, "fill": "#HEXCODE" }
  ]
}
${modePrompt}
Do not wrap JSON in markdown block. Just output valid JSON without any other text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.text;
        res.status(200).json(JSON.parse(text));
    } catch (error) {
        console.error('Error calling Gemini for Design:', error);
        res.status(500).json({ error: 'Failed to generate design' });
    }
}
