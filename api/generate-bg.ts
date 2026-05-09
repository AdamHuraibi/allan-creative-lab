import { GoogleGenAI } from '@google/genai';
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
        const { prompt, aspectRatio } = req.body;
        // aspectRatio can be '1:1', '9:16', '4:5', '16:9'

        let configAspectRatio = '1:1';
        if (aspectRatio === '9:16') configAspectRatio = '9:16';
        else if (aspectRatio === '4:5') configAspectRatio = '3:4'; // Fallback
        else if (aspectRatio === '16:9') configAspectRatio = '16:9';

        const result = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt + ", high quality, detailed, Yemeni rural and cultural context",
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: configAspectRatio
            }
        });

        const image = result.generatedImages[0];
        if (!image) {
           return res.status(500).json({ error: 'No image generated.' });
        }

        const dataUrl = `data:image/jpeg;base64,${image.image.imageBytes}`;
        res.status(200).json({ image: dataUrl });
    } catch (error: any) {
        console.error('Error calling Imagen:', error);
        res.status(500).json({ error: 'Failed to generate background image: ' + error.message });
    }
}
