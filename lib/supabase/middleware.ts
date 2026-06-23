import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseAnonKey, getSupabasePublicUrl } from '@/lib/supabase/config';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = getSupabasePublicUrl();
  const anon = getSupabaseAnonKey();
  if (!url || !anon) {
    return response;
  }

  try {
    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    await supabase.auth.getUser();
  } catch (err) {
    console.error('[supabase middleware]', err);
    return NextResponse.next({ request });
  }

  return response;
}
