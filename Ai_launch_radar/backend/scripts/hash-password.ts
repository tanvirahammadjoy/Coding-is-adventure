/**
 * Run: npx ts-node scripts/hash-password.ts "your-password-here"
 * Copy the printed hash into ADMIN_PASSWORD_HASH in your .env — the
 * plaintext password is never stored, only this hash.
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: npx ts-node scripts/hash-password.ts <password>");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nAdd this to your .env as ADMIN_PASSWORD_HASH:\n");
console.log(hash);
console.log("");
