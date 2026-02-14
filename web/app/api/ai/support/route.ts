import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { query, history, context } = await req.json();

        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash-latest",
            systemInstruction: `
                You are the GridFlow AI Support Agent. 
                Your goal is to help users with data extraction, cleaning, and account management.
                
                **GridFlow AI Platform Specs:**
                - Free Tier: 10,000 rows/month, 512MB storage.
                - Pro Plan: Unlimited rows, API access, team collaboration.
                - Extraction Engines: Jina Reader (standard), AI Semantic Parser (advanced).
                - Export Formats: Excel (.xlsx), Word (.docx), PowerPoint (.pptx), CSV.
                
                **User Context:**
                ${JSON.stringify(context || {})}
                
                **Instructions:**
                1. Be concise, professional, and helpful.
                2. Use the "User Context" to provide personalized answers (e.g., if they are near their limit, suggest upgrading).
                3. If asked about technical API details, refer to POST /api/extract and POST /api/clean.
                4. Tone: Technical, efficient, slightly futuristic.
            `
        });

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(query);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });

    } catch (error: any) {
        console.error('Support API Error:', error);
        return NextResponse.json({ error: 'I am experiencing a momentary neural desync. Please try again.' }, { status: 500 });
    }
}
