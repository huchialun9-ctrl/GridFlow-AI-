import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
// Ensure GEMINI_API_KEY is in .env.local
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // 1. Fetch Raw Markdown via Jina Reader
        const jinaResponse = await fetch(`https://r.jina.ai/${url}`, {
            headers: { 'X-Return-Format': 'markdown' }
        });

        if (!jinaResponse.ok) {
            throw new Error(`Failed to fetch from Jina Reader: ${jinaResponse.statusText}`);
        }

        const rawMarkdown = await jinaResponse.text();

        // 2. AI Extraction Logic (Gemini 1.5 Flash)
        if (process.env.GEMINI_API_KEY) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `
                    You are a precise data extraction engine. 
                    I will provide you with the markdown content of a webpage.
                    Your task is to identify the MAIN data table, list, or content stream on this page.
                    
                    Rules:
                    1. Extract the data into a clean JSON array of objects.
                    2. Keys should be snake_case (e.g., product_name, price, date).
                    3. Remove any advertisements, navigation links, or irrelevant footer content.
                    4. If there are multiple potential tables, choose the one that looks like the primary content (e.g. search results, product list).
                    5. Return ONLY the JSON string, no markdown formatting (no \`\`\`json blocks).
                    6. Limit to top 50 rows if the list is very long.

                    Markdown Content:
                    ${rawMarkdown.slice(0, 30000)} // Truncate to avoid context limits if extremely large
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();
                
                // Clean up potential markdown code blocks
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                const rows = JSON.parse(text);
                
                // Validate it's an array
                if (Array.isArray(rows) && rows.length > 0) {
                    const headers = Object.keys(rows[0]);
                    
                    // Convert to 2D array for the frontend [[val1, val2], ...]
                    const formattedRows = rows.map(row => headers.map(h => {
                        const val = row[h];
                         return typeof val === 'object' ? JSON.stringify(val) : String(val);
                    }));

                    const name = url.replace('https://', '').replace('www.', '').split('/')[0] + ' AI_Extract';

                    return NextResponse.json({
                        name,
                        headers,
                        rows: formattedRows,
                        rowCount: formattedRows.length,
                        aiModel: 'gemini-1.5-flash'
                    });
                }

            } catch (aiError) {
                console.error('Gemini Extraction Failed:', aiError);
                // Fallback to heuristic if AI fails
            }
        }

        // 3. Fallback Heuristic (Simple Regex)
        // [Existing logic as backup]
        const lines = rawMarkdown.split('\n').filter(line => line.trim().length > 0);
        const items = lines
            .filter(line => (line.includes('[') && line.includes('](')) || line.startsWith('| '))
            .map(line => {
                const titleMatch = line.match(/\[(.*?)\]/);
                const urlMatch = line.match(/\((.*?)\)/);
                return [
                    titleMatch ? titleMatch[1] : line.slice(0, 50),
                    urlMatch ? urlMatch[1] : 'Text Node',
                    line.length + ''
                ];
            })
            .slice(0, 50);

        return NextResponse.json({
            name: 'Raw_Extract_Fallback',
            headers: ['Content', 'Link', 'Length'],
            rows: items,
            rowCount: items.length,
            aiModel: 'none'
        });

    } catch (error: any) {
        console.error('Extraction API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
