import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_NAME } from "@/lib/auth-constants";

const LOGIN_PATH = "/login";

/** Pages d'authentification publiques. */
const PUBLIC_PATHS = new Set(["/login", "/signup"]);

/**
 * Protège les espaces privés au niveau du routeur :
 * - /login & /signup : accessibles à tous.
 * - /admin/* et /mon-compte : redirigent vers /login si pas de session.
 *
 * Le middleware vérifie la présence du cookie ; la vérification cryptographique
 * du token ET du rôle est réalisée côté serveur (server components / actions),
 * c'est la véritable barrière de sécurité (défense en profondeur).
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(COOKIE_NAME)?.value);

  // Pages d'auth : redirige vers l'accueil si déjà connecté.
  if (PUBLIC_PATHS.has(pathname)) {
    if (hasSession) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Routes protégées nécessitant une session.
  const isProtected =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/mon-compte";

  if (isProtected && !hasSession) {
    const url = new URL(LOGIN_PATH, req.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/admin", "/admin/:path*", "/mon-compte"],
};
