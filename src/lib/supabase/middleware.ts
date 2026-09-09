import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/env";

/**
 * Rafraîchit la session Supabase à chaque requête passant par le middleware
 * (pattern officiel @supabase/ssr). Renvoie la réponse à retourner et
 * l'utilisateur authentifié (ou null).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // Ne pas exécuter de code entre createServerClient et getUser()
  // (nécessaire pour un rafraîchissement correct du token).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}