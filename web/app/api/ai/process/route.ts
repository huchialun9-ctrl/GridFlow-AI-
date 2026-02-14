
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { data, prompt } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is missing in environment' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            systemInstruction: `
                You are a Professional Data Analyst for GridFlow AI.
                The user provides a JSON array of table rows and a specific transformation command.
                
                **Rules:**
                1. ONLY return valid JSON. No markdown code blocks.
                2. Preserve row integrity while modifying values based on the command.
                3. If asked for a summary, add a "summary" field to relevant objects.
                4. Normalize schema if "normalize" is mentioned.
            `
        });

        if (!data || !prompt) {
            return NextResponse.json({ error: 'Data and prompt are required' }, { status: 400 });
        }

        // Prepare the payload for AI
        const sampleData = data.slice(0, 50);

        const userMessage = `Command: ${prompt}\n\nData: ${JSON.stringify(sampleData)}`;

        const result = await model.generateContent(userMessage);

        const response = await result.response;
        let text = response.text();

        // Clean up markdown if Gemini includes it despite instructions
        text = text.replace(/```json\n?|```/g, '').trim();

        let refinedData;
        try {
            const parsed = JSON.parse(text);
            // Handle if Gemini wraps in a key like { data: [...] } or { result: [...] }
            refinedData = Array.isArray(parsed) ? parsed : (parsed.data || parsed.rows || parsed.result || []);
        } catch (e) {
            console.error("Failed to parse Gemini JSON:", text);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        return NextResponse.json({
            refinedData,
            usage: { total_tokens: 0 } // Gemini doesn't always return token usage in the simple response object easily, keeping structure
        });

    } catch (error: any) {
        console.error('AI Processor Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
