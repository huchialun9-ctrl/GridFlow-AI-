
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const { data, prompt } = await req.json();

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: 'OpenAI API Key is missing in environment' }, { status: 500 });
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        if (!data || !prompt) {
            return NextResponse.json({ error: 'Data and prompt are required' }, { status: 400 });
        }

        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json({ error: 'OpenAI API Key is missing in environment' }, { status: 500 });
        }

        // Prepare the payload for AI
        // We send a sample of the data to keep tokens low if it's a huge table
        const sampleData = data.slice(0, 50); 
        
        const systemPrompt = `
            You are a Professional Data Analyst for GridFlow AI. 
            The user will provide a JSON array of table rows and a specific command/prompt.
            Your task is to process the data according to the prompt and return the REFINED JSON array.
            
            Rules:
            1. ONLY return valid JSON. No markdown explanation.
            2. Maintain the structure (array of arrays or array of objects).
            3. If the user asks to add a column, ensure every row has the new value.
            4. If the user asks for summaries or translations, modify the content accordingly.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Command: ${prompt}\n\nData: ${JSON.stringify(sampleData)}` }
            ],
            response_format: { type: "json_object" }
        });

        const resultText = response.choices[0].message.content;
        const resultJson = JSON.parse(resultText || '{}');

        // Extract the array from the JSON object (OpenAI usually wraps it)
        const refinedData = resultJson.data || resultJson.rows || resultJson;

        return NextResponse.json({
            refinedData,
            usage: response.usage
        });

    } catch (error: any) {
        console.error('AI Processor Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
