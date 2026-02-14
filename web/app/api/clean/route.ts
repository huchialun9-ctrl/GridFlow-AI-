import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { rows, headers, filename } = await req.json();

        if (!rows || !Array.isArray(rows)) {
            return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
        }

        if (process.env.GEMINI_API_KEY) {
            try {
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash-latest",
                    systemInstruction: `
                        You are a Professional Data Sanitization Expert.
                        Your primary goal is to clean and standardize irregular datasets while preserving semantic integrity.
                        
                        **Cleaning Protocols:**
                        1. **Header Normalization**: Rename headers to standardized snake_case (e.g., "Full Name" -> "full_name").
                        2. **Format Synthesis**: Standardize dates to ISO 8601, currency to flat floating-point numbers, and strings to trimmed proper casing.
                        3. **Deduplication**: Identify and merge near-identical entries.
                        4. **Anomaly Correction**: Fix obvious typos and standardize unit measurements.
                        
                        **Constraint**: Output MUST be a valid JSON object containing "report" and "cleanedRows".
                    `
                });

                const prompt = `
                    Clean the following dataset from file: "${filename}".
                    Raw Headers: ${JSON.stringify(headers)}.
                    Raw Rows: ${JSON.stringify(rows)}
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

                text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                const json = JSON.parse(text);

                return NextResponse.json(json);

            } catch (aiError: any) {
                console.error('Gemini Cleaning Failed:', aiError);
                return NextResponse.json({ error: 'AI processing failed: ' + aiError.message }, { status: 500 });
            }
        } else {
            return NextResponse.json({ error: 'AI Service Config Missing' }, { status: 503 });
        }

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
