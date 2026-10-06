import "server-only";

const isProd = process.env.NODE_ENV === "production";

// Local development falls back to the docker-compose Postgres so the project runs
// without a .env file. Production must provide real values.
if (!process.env.DATABASE_URL && !isProd) {
  process.env.DATABASE_URL = "postgresql://yeg:yeg_local_dev@localhost:5433/yeg?schema=public";
}

function required(name: string, devFallback: string) {
  const value = process.env[name];
  if (value) return value;
  if (isProd) throw new Error(`Missing required environment variable: ${name}`);
  return devFallback;
}

export const env = {
  get authSecret() {
    return required("AUTH_SECRET", "yeg-local-dev-secret-do-not-use-in-production-000000");
  },
};
