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
        const { format, tone, targetMode } = req.body;

        const prompt = `أنت خبير في الإعداد الإبداعي وكتابة الاسكربتات الخاصة بالبودكاست، ومتخصص في التراث والزراعة في اليمن وتحديدا مشروع "علّان".
المطلوب كتابة اسكربت بناءً على المقاييس التالية:
- قالب البودكاست (Format): ${format}
- نبرة الصوت (Tone): ${tone}
- سياق المحتوى (Context): ${targetMode}

يجب أن يكون الاسكربت باللغة العربية حصراً ويبدأ بعنوان رئيسي جذاب، ثم يتضمن:
- مقدمة مشوقة (Hook/Intro).
- تبادل أدوار بصيغة حوارية أو سردية بين "Host" و "صوت المجتمع" أو "ضيف".
- إرشادات الأداء للمؤثرات الصوتية (SFX) بين قوسين.
- خاتمة مؤثرة (Outro).
لا تقم بكتابة مقدمات طويلة عن استجابتك للطلب، واطبع الاسكربت المولد مباشرة بتنسيق Markdown.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.status(200).json({ script: response.text });
    } catch (error) {
        console.error('Error calling Gemini:', error);
        res.status(500).json({ error: 'Failed to generate script' });
    }
}
