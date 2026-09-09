/**
 * Configuration Supabase (variables publiques, inlinées au build).
 * L'URL du projet et la clé anon sont publiques par conception : elles
 * servent uniquement au client Supabase et n'exposent aucune donnée.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont requises (voir .env.example)",
  );
}

export const SUPABASE_URL = url;
export const SUPABASE_ANON_KEY = anonKey;