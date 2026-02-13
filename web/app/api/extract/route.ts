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
        let rawMarkdown = '';
        try {
            const jinaResponse = await fetch(`https://r.jina.ai/${url}`, {
                headers: {
                    'X-Return-Format': 'markdown',
                    'User-Agent': req.headers.get('user-agent') || 'Mozilla/5.0 (GridFlow-AI Extraction Engine)',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': req.headers.get('accept-language') || 'en-US,en;q=0.9',
                }
            });

            if (!jinaResponse.ok) {
                const errorText = await jinaResponse.text().catch(() => '');
                console.warn(`Jina Reader Warning (${jinaResponse.status}): ${jinaResponse.statusText}`);

                if (jinaResponse.status === 403) {
                    console.warn('Jina Forbidden (403), will attempt direct fallback.');
                }
            } else {
                rawMarkdown = await jinaResponse.text();
            }
        } catch (jinaError: any) {
            console.error('Jina Fetch Error:', jinaError);
        }

        if (!rawMarkdown) {
            // Attempt secondary simple fetch as a very basic fallback for some sites
            try {
                const directResponse = await fetch(url, {
                    headers: {
                        'User-Agent': req.headers.get('user-agent') || 'Mozilla/5.0 (GridFlow-AI Fallback Engine)',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                        'Accept-Language': req.headers.get('accept-language') || 'en-US,en;q=0.9',
                        'Referer': url,
                    }
                });

                if (directResponse.ok) {
                    let html = await directResponse.text();

                    // Improved HTML cleaning: remove scripts, styles, and comments first
                    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                        .replace(/<!--[\s\S]*?-->/g, '');

                    // Simple text extraction from remaining HTML
                    rawMarkdown = html.replace(/<[^>]*>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim()
                        .slice(0, 30000); // Give AI more context if it's raw text

                    console.log(`Direct fallback successful. Extracted ${rawMarkdown.length} chars.`);
                }
            } catch (fallbackError) {
                console.error('Direct fallback fetch failed:', fallbackError);
            }
        }

        if (!rawMarkdown) {
            return NextResponse.json({ error: 'Failed to retrieve content from the target URL. Please try another site.' }, { status: 422 });
        }

        // 2. AI Extraction Logic (Gemini 1.5 Flash)
        if (process.env.GEMINI_API_KEY && rawMarkdown.length > 50) {
            try {
                const { mode = 'excel' } = await req.clone().json().catch(() => ({}));
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                let prompt = '';

                if (mode === 'word') {
                    prompt = `
                        You are a Semantic Document Architect.
                        Analyze the Markdown content and transform it into a well-structured document hierarchy.

                        **Objective:**
                        Extract the content while preserving its logical flow, headers, and semantic roles (e.g., Intro, Analysis, Findings).

                        **Strict Extraction Rules:**
                        1. **Output Format:** JSON Object with keys: "data" (array of objects), "metadata" (object).
                        2. **Data Structure:** Each item in "data" MUST have:
                           - "role": (e.g., "Main Title", "Section Header", "Paragraph", "Bullet Point")
                           - "content": The actual text.
                        3. **Metadata:**
                           - "entity_type": "Structured Document"
                           - "page_title": The document's primary subject.
                           - "tone": (e.g., "Professional", "Technical", "Informative")

                        **Response Format (JSON ONLY):**
                        {
                            "data": [
                                { "role": "Main Title", "content": "..." },
                                { "role": "Section Header", "content": "..." },
                                { "role": "Paragraph", "content": "..." }
                            ],
                            "metadata": { "entity_type": "Structured Document", "page_title": "..." }
                        }

                        **Content Source Notice:** This content was retrieved via fallback direct fetch. Preserve the semantic meaning while ignoring technical debris.

                        **Markdown/Text Content:**
                        ${rawMarkdown.slice(0, 40000)}
                    `;
                } else if (mode === 'ppt') {
                    prompt = `
                        You are a Visual Information Designer.
                        Analyze the Markdown content and decompose it into distinct presentation slides.

                        **Objective:**
                        Extract data and themes suitable for a professional slide deck. Identify logical breaks for individual slides.

                        **Strict Extraction Rules:**
                        1. **Output Format:** JSON Object with keys: "data" (array of objects), "metadata" (object).
                        2. **Data Structure:** Each item in "data" MUST represent a slide with:
                           - "slide_title": The headline of the slide.
                           - "bullet_points": An array of strings containing supporting details or data points.
                        3. **Metadata:**
                           - "entity_type": "Presentation Outline"
                           - "presentation_theme": The overall narrative arc.

                        **Response Format (JSON ONLY):**
                        {
                            "data": [
                                { "slide_title": "...", "bullet_points": ["...", "..."] }
                            ],
                            "metadata": { "entity_type": "Presentation Outline", "presentation_theme": "..." }
                        }

                        **Content Source Notice:** This content was retrieved via fallback direct fetch. De-clutter the content to focus on the presentation-worthy core.

                        **Markdown/Text Content:**
                        ${rawMarkdown.slice(0, 40000)}
                    `;
                } else {
                    // Default Excel mode
                    prompt = `
                        You are a world-class Data Extraction Expert.
                        Analyze the provided Markdown content and extract the primary recurring dataset.

                        **Objective:**
                        Identify the main recurring entity list (e.g., Products, Leads, Transactions) and extract structured rows.

                        **Strict Extraction Rules:**
                        1. **Output Format:** JSON Object with keys: "data" (array of objects), "metadata" (object).
                        2. **Metadata:** "entity_type" (e.g. "Product"), "page_title".

                        **Content Source Notice:** This content was retrieved via fallback direct fetch and may contain some remaining HTML noise. Please focus on the primary semantic data.

                        **Markdown/Text Content:**
                        ${rawMarkdown.slice(0, 40000)}
                    `;
                }

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();

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
                        aiModel: 'gemini-1.5-flash',
                        metadata
                    });
                }

            } catch (aiError) {
                console.error('Gemini Extraction Failed:', aiError);
                // Fallback to heuristic if AI fails
            }
        }

        // 3. Fallback Heuristic (Simple Regex)
        let items: any[][] = rawMarkdown.split('\n')
            .filter(line => line.trim().length > 0)
            .filter(line => (line.includes('[') && line.includes('](')) || line.startsWith('| '))
            .map(line => {
                const titleMatch = line.match(/\[(.*?)\]/);
                const urlMatch = line.match(/\((.*?)\)/);
                return [
                    titleMatch ? titleMatch[1] : line.slice(0, 100).trim(),
                    urlMatch ? urlMatch[1] : 'Text Node',
                    line.length + ''
                ];
            })
            .slice(0, 50);

        // If no structured data found but we have content, return as a single "Document Snapshot" row
        if (items.length === 0 && rawMarkdown.length > 0) {
            items = [[
                rawMarkdown.slice(0, 1000).replace(/\s+/g, ' ').trim() + (rawMarkdown.length > 1000 ? '...' : ''),
                url,
                rawMarkdown.length + ''
            ]];
        }

        return NextResponse.json({
            name: items.length > 0 ? 'Raw_Extract_Fallback' : 'Extraction_Failed',
            headers: ['Content', 'Source', 'Chars'],
            rows: items,
            rowCount: items.length,
            aiModel: 'none'
        });

    } catch (error: any) {
        console.error('Extraction API Error:', error);

        let errorMessage = error.message || 'Unknown extraction error';
        let statusCode = 500;

        if (error.message === 'SITE_FORBIDDEN') {
            errorMessage = 'This website is protected by security protocols (Anti-Bot) and cannot be extracted at this time. Please try another source.';
            statusCode = 403;
        }

        return NextResponse.json({
            error: errorMessage,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: statusCode });
    }
}
