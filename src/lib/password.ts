import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

/**
 * Hachage sécurisé des mots de passe via scrypt (Node built-in).
 * Format stocké : "<salt_hex>:<hash_hex>". Aucune dépendance externe.
 */
const KEY_LEN = 64;
const SALT_LEN = 16;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LEN).toString("hex");
  const hash = scryptSync(password, salt, KEY_LEN).toString("hex");
  return `${salt}:${hash}`;
}

/** Vérifie un mot de passe contre la valeur hachée stockée (comparaison à temps constant). */
export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  try {
    const computed = scryptSync(password, salt, KEY_LEN);
    const expected = Buffer.from(key, "hex");
    return (
      computed.length === expected.length &&
      timingSafeEqual(computed, expected)
    );
  } catch {
    return false;
  }
}
