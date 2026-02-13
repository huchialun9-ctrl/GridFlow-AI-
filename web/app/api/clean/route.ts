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
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                // Construct a prompt to clean the data
                const prompt = `
                    You are a Data Cleaning Expert.
                    I have a dataset from a file named "${filename}".
                    The current headers are: ${JSON.stringify(headers)}.
                    Here is a sample of the raw rows:
                    ${JSON.stringify(rows)}

                    Your task:
                    1. Analyze the data to understand what entity it represents (e.g. Products, Customers, Leads).
                    2. Clean the data:
                       - Fix typos in values.
                       - Standardize formats (e.g. dates to ISO, currency to numbers).
                       - Remove null/empty keys if they are useless.
                       - Rename headers to be standard snake_case (e.g. "Prod Name" -> "product_name").
                    3. Return the CLEANED data as a JSON array of objects.
                    4. Also return a short "report" string explaining what you did.

                    Output Format (JSON):
                    {
                        "report": "I standardized dates ...",
                        "cleanedRows": [ ... ]
                    }
                    
                    Return ONLY the JSON string.
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
