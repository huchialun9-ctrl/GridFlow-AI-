import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabaseServer'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const requestUrl = new URL(request.url)
            return NextResponse.redirect(`${requestUrl.origin}${next}`)
        }
    }

    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
