export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Using a relative URL or absolute production URL is safer on Railway
            const forwardHost = request.headers.get('x-forwarded-host') || request.headers.get('host')
            const protocol = request.headers.get('x-forwarded-proto') || 'https'

            if (forwardHost && !forwardHost.includes('localhost')) {
                return NextResponse.redirect(`${protocol}://${forwardHost}${next}`)
            }
            return NextResponse.redirect(new URL(next, request.url))
        }
    }

    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
