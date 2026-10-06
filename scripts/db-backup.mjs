/**
 * Full database backup — products, content, settings AND every image/video (they live in the DB).
 * Writes backups/yeg-YYYY-MM-DD-HHMM.dump (pg_dump custom format).
 * Restore: docker exec -i yeg-postgres pg_restore -U yeg -d yeg --clean --if-exists < backups/<file>.dump
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const dir = path.join(ROOT, "backups");
fs.mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().slice(0, 16).replace("T", "-").replace(":", "");
const file = path.join(dir, `yeg-${stamp}.dump`);

const out = fs.createWriteStream(file);
const dump = spawn("docker", ["exec", "yeg-postgres", "pg_dump", "-U", "yeg", "-d", "yeg", "-Fc"], { stdio: ["ignore", "pipe", "inherit"] });
dump.stdout.pipe(out);
dump.on("close", (code) => {
  out.close();
  if (code !== 0) {
    fs.rmSync(file, { force: true });
    console.error("Backup failed (is the yeg-postgres container running?)");
    process.exit(code ?? 1);
  }
  console.log(`Backup written: ${path.relative(ROOT, file)} (${(fs.statSync(file).size / 1024 / 1024).toFixed(1)} MB)`);
});
