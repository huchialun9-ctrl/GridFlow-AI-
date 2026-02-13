import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import crypto from 'crypto';

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: keys, error } = await supabase
    .from('api_keys')
    .select('id, name, created_at, last_used_at, scopes')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ keys });
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const { name, scopes } = json;

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // 1. Generate a secure random key
    // Prefix with sk_live_ to make it identifiable
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const rawKey = `sk_live_${randomBytes}`;
    
    // 2. Hash the key for storage (SHA-256)
    // We never store the raw key
    const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');

    // 3. Insert into DB
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        user_id: user.id,
        name,
        key_hash: keyHash,
        scopes: scopes || ['read:datasets', 'write:extract']
      })
      .select('id, name, created_at, scopes')
      .single();

    if (error) {
       console.error('Supabase error:', error);
       return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 4. Return the RAW key to the user ONLY ONCE
    return NextResponse.json({ 
        key: {
            ...data,
            secret: rawKey // IMPORTANT: This is the only time the user sees this
        } 
    });

  } catch (error: any) {
    console.error('API Key creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
    
        if (!user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('api_keys')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
