
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session || !session.provider_token) {
            // If no provider token (e.g. email login), we can't sync to Gist easily without asking for PAT.
            // For Phase 2, we assume GitHub Login or warn user.
            // Actually, we can check if user provided a PAT in settings (if we implemented that).
            // For now, let's return a specific error code to UI.
            return NextResponse.json({ error: 'GitHub Provider Token not found. Please login with GitHub.' }, { status: 401 });
        }

        const { filename, content, schema } = await req.json();

        if (!filename || !content) {
             return NextResponse.json({ error: 'Filename and content are required' }, { status: 400 });
        }

        // Create Gist via GitHub API
        const response = await fetch('https://api.github.com/gists', {
            method: 'POST',
            headers: {
                'Authorization': `token ${session.provider_token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: `GridFlow AI Export: ${filename}`,
                public: false, // Secret Gist by default
                files: {
                    [filename]: {
                        content: content
                    }
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API Error:', errorText);
            return NextResponse.json({ error: `GitHub API Error: ${response.statusText}` }, { status: response.status });
        }

        const gistData = await response.json();

        return NextResponse.json({ 
            success: true, 
            html_url: gistData.html_url,
            id: gistData.id
        });

    } catch (error: any) {
        console.error('Gist Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
