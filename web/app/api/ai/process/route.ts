
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { data, prompt } = await req.json();

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: 'GEMINI_API_KEY is missing in environment' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        if (!data || !prompt) {
            return NextResponse.json({ error: 'Data and prompt are required' }, { status: 400 });
        }

        // Prepare the payload for AI
        // We send a sample of the data to keep tokens low if it's a huge table
        const sampleData = data.slice(0, 50);

        const systemPrompt = `
            You are a Professional Data Analyst for GridFlow AI. 
            The user will provide a JSON array of table rows and a specific command/prompt.
            Your task is to process the data according to the prompt and return the REFINED JSON array.
            
            Rules:
            1. ONLY return valid JSON. Do not include markdown code blocks (e.g., \`\`\`json).
            2. Maintain the structure (array of arrays or array of objects).
            3. If the user asks to add a column, ensure every row has the new value.
            4. If the user asks for summaries or translations, modify the content accordingly.
            5. If detecting schema, normalize headers to snake_case or specific format requested.
        `;

        const userMessage = `Command: ${prompt}\n\nData: ${JSON.stringify(sampleData)}`;

        const result = await model.generateContent([
            systemPrompt,
            userMessage
        ]);

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
