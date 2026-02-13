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
                    You are a world-class Data Extraction Expert.
                    Analyze the provided Markdown content from a webpage and extract the primary dataset.

                    **Objective:**
                    Identify the main recurring entity list (e.g., Products, Articles, Job Postings, Real Estate Listings, Crypto Tokens) and extract structured data.

                    **Strict Extraction Rules:**
                    1. **Output Format:** JSON Object with keys: "data" (array of objects), "metadata" (object).
                    2. **Data Cleaning:** 
                       - Remove ads, nav links, footers, and "sponsored" clutter.
                       - Normalize all keys to snake_case (e.g., product_title, current_price, posted_date).
                       - Ensure numeric values are numbers (remove currency symbols if possible, or keep as string if complex).
                       - Flatten nested objects where reasonable (e.g. author.name -> author_name).
                    3. **Metadata:**
                       - "entity_type": What are these rows? (e.g. "Product", "Article").
                       - "page_title": The likely title of the dataset.
                       - "confidence_score": 0.0 to 1.0 (how clean is the data?).
                    4. **Limit:** Extract up to 100 rows.

                    **Response Format (JSON ONLY, NO Markdown):**
                    {
                        "data": [
                            { "col_1": "val", "col_2": "val" }
                        ],
                        "metadata": {
                            "entity_type": "...",
                            "page_title": "...",
                            "confidence_score": 0.95
                        }
                    }

                    **Markdown Content:**
                    ${rawMarkdown.slice(0, 40000)}
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();
                
                // Clean up potential markdown code blocks
                // Clean up potential markdown code blocks
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();

                const jsonResult = JSON.parse(text);
                const rows = jsonResult.data || [];
                const metadata = jsonResult.metadata || {};
                
                // Validate it's an array
                if (Array.isArray(rows) && rows.length > 0) {
                    const headers = Object.keys(rows[0]);
                    
                    // Convert to 2D array for the frontend [[val1, val2], ...]
                    const formattedRows = rows.map(row => headers.map(h => {
                        const val = row[h];
                         return typeof val === 'object' ? JSON.stringify(val) : String(val);
                    }));

                    const name = (metadata.page_title || url.replace('https://', '')) + ` (${metadata.entity_type || 'Data'})`;

                    return NextResponse.json({
                        name,
                        headers,
                        rows: formattedRows,
                        rowCount: formattedRows.length,
                        aiModel: 'gemini-1.5-flash-v2',
                        metadata
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
