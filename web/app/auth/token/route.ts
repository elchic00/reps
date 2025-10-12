import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const access_token = requestUrl.searchParams.get('access_token');
  const refresh_token = requestUrl.searchParams.get('refresh_token');
  const redirect = requestUrl.searchParams.get('redirect') || '/';

  if (!access_token || !refresh_token) {
    // If no tokens provided, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    );

    // Set the session using the tokens from mobile
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (error) {
      console.error('Error setting session:', error);
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
    }

    // Successfully authenticated, redirect to the intended page
    return NextResponse.redirect(new URL(redirect, request.url));
  } catch (error) {
    console.error('Token auth error:', error);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}
