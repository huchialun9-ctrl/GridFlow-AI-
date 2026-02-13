
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer'; 
// Note: We'll standard client for API Key check, but we need elevated privs or RLS bypass maybe? 
// Actually, valid API key acts as auth.

import crypto from 'crypto';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ recipe_id: string }> }
) {
    const { recipe_id } = await params;
    const apiKeyHeader = req.headers.get('x-api-key');

    if (!apiKeyHeader) {
        return NextResponse.json({ error: 'Missing x-api-key header' }, { status: 401 });
    }

    const supabase = await createClient();

    // 1. Verify API Key
    // We strictly compare hashes.
    // Ideally we cache this or use a more performant look up, but for now strict DB query is fine.
    // Since we store HASH, we need to verify if the provided raw key matches?
    // Wait, typical pattern:
    // Stored: key_hash
    // User sends: full_key (e.g. sk_live_abc123...)
    // We hash the incoming key and compare.
    
    // We need to fetch ALL keys? No, that's slow.
    // We can't query by hash because we have to hash the input first.
    // Yes, we hash the input.
    const providedHash = crypto.createHash('sha256').update(apiKeyHeader).digest('hex');
    
    // Find the key
    const { data: keyData, error: keyError } = await supabase
        .from('api_keys')
        .select('user_id, scopes')
        .eq('key_hash', providedHash)
        .single();
    
    if (keyError || !keyData) {
        return NextResponse.json({ error: 'Invalid API Key' }, { status: 403 });
    }

    // 2. Fetch Recipe & Latest Data
    // We need to ensure the recipe belongs to the API key's user
    const { data: latestDataset, error: datasetError } = await supabase
        .from('datasets')
        .select('rows, headers, created_at')
        .eq('recipe_id', recipe_id)
        .eq('user_id', keyData.user_id) // Security check
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (datasetError || !latestDataset) {
        // Check if recipe exists separately to give better error?
         return NextResponse.json({ error: 'Recipe not found or no data available' }, { status: 404 });
    }

    // 3. Update last_used_at (Non-blocking)
    supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('key_hash', providedHash).then();

    return NextResponse.json({
        meta: {
            recipe_id,
            extracted_at: latestDataset.created_at,
            count: latestDataset.rows?.length || 0
        },
        data: latestDataset.rows
    });
}
