/**
 * Initialise le compte administrateur principal d'Immo Maroc.
 * Idempotent : crée le compte s'il n'existe pas, sinon met à jour le mot de passe.
 *
 * Les identifiants sont fournis via les variables d'environnement
 * ADMIN_SEED_EMAIL et ADMIN_SEED_PASSWORD (jamais en clair dans ce fichier).
 *
 * Lancement :  node seed-admin.mjs
 */
import "dotenv/config"; // charge automatiquement le fichier .env (si présent)
import { randomBytes, scryptSync } from "node:crypto";
import pg from "pg";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

// --- Identifiants administrateur (obligatoires) ---
const ADMIN_EMAIL = process.env.ADMIN_SEED_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_SEED_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "\n[seed-admin] ERREUR : variables d'environnement manquantes.\n" +
      "Définissez ADMIN_SEED_EMAIL et ADMIN_SEED_PASSWORD avant de lancer le script.\n" +
      "Exemple : ADMIN_SEED_EMAIL=admin@immomaroc.ma ADMIN_SEED_PASSWORD=******** node seed-admin.mjs\n",
  );
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 8) {
  console.error(
    "\n[seed-admin] ERREUR : ADMIN_SEED_PASSWORD doit contenir au moins 8 caractères.\n",
  );
  process.exit(1);
}

const ADMIN_NAME = "Immo Maroc";
const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

/** Hachage scrypt identique à src/lib/password.ts (format "salt:hash"). */
function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const pool = new pg.Pool({ connectionString: DATABASE_URL });
  try {
    const { rows } = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail],
    );

    if (rows.length > 0) {
      await pool.query(
        "UPDATE users SET password_hash = $1, role = 'admin', name = $2 WHERE email = $3",
        [hashPassword(ADMIN_PASSWORD), ADMIN_NAME, normalizedEmail],
      );
      console.log("✓ Compte admin mis à jour :", normalizedEmail);
    } else {
      await pool.query(
        "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')",
        [ADMIN_NAME, normalizedEmail, hashPassword(ADMIN_PASSWORD)],
      );
      console.log("✓ Compte admin créé :", normalizedEmail);
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Erreur lors de l'initialisation du compte admin :", err);
  process.exit(1);
});
