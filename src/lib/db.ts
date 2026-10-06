import "server-only";
import "./env";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * `next build` prerenders every page × locale in parallel workers, each with its own pool.
 * Keep each build worker's pool small so the total stays under Postgres' connection limit.
 */
function datasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || process.env.NEXT_PHASE !== "phase-production-build" || /[?&]connection_limit=/.test(url)) return undefined;
  return `${url}${url.includes("?") ? "&" : "?"}connection_limit=3`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: datasourceUrl(),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

// One client per process — also in production, where every route bundle would otherwise open its own pool.
globalForPrisma.prisma = db;

