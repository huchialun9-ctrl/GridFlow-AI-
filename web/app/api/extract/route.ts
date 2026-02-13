
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        if (!url) {
            return NextResponse.json({ error: 'URL is required' }, { status: 400 });
        }

        // Use Jina Reader API to get a structured markdown representation of the webpage
        // This is a real API that fetches actual content
        const response = await fetch(`https://r.jina.ai/${url}`, {
            headers: {
                'X-Return-Format': 'markdown'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from Jina Reader: ${response.statusText}`);
        }

        const data = await response.text();

        // Simple heuristic to extract "rows" from markdown: look for list items or table rows
        // For this real-world integration, we'll extract headers and rows based on what Jina returns
        const lines = data.split('\n').filter(line => line.trim().length > 0);
        
        // Let's try to extract meaningful items (e.g., links and titles)
        const items = lines
            .filter(line => line.includes('[') && line.includes('](')) // Likely links
            .map(line => {
                const titleMatch = line.match(/\[(.*?)\]/);
                const urlMatch = line.match(/\((.*?)\)/);
                return [
                    titleMatch ? titleMatch[1] : 'Unknown Title',
                    urlMatch ? urlMatch[1] : 'No URL',
                    line.length + ' chars'
                ];
            })
            .slice(0, 50); // Limit to top 50 items

        const headers = ['Content_Title', 'Redirect_URL', 'Metadata'];
        const name = url.replace('https://', '').replace('www.', '').split('/')[0] + ' Extractor';

        return NextResponse.json({
            name,
            headers,
            rows: items,
            rowCount: items.length
        });

    } catch (error: any) {
        console.error('Extraction API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
