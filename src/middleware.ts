import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const LOGIN_PATH = "/login";

/** Pages d'authentification publiques. */
const PUBLIC_PATHS = new Set(["/login", "/signup"]);

/**
 * Protège les espaces privés au niveau du routeur :
 * - /login & /signup : accessibles à tous (redirection si déjà connecté) ;
 * - /admin/* et /mon-compte : redirigent vers /login si pas de session.
 *
 * La session est vérifiée cryptographiquement via Supabase Auth (getUser) ;
 * la vérification du rôle admin est réalisée côté serveur (server components
 * / actions), c'est la véritable barrière de sécurité (défense en profondeur).
 */
export async function middleware(req: NextRequest) {
  const { supabaseResponse, user } = await updateSession(req);
  const { pathname } = req.nextUrl;
  const loggedIn = Boolean(user);

  // Pages d'auth : redirige vers l'accueil si déjà connecté.
  if (PUBLIC_PATHS.has(pathname)) {
    if (loggedIn) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return supabaseResponse;
  }

  // Routes protégées nécessitant une session valide.
  const isProtected =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/mon-compte";

  if (isProtected && !loggedIn) {
    const url = new URL(LOGIN_PATH, req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/login", "/signup", "/admin", "/admin/:path*", "/mon-compte"],
};