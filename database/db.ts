import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Parse connection string into individual parameters for Node.js 24+ compatibility.
 * The pg library has issues parsing URLs with Node.js 24's stricter URL parsing.
 */
function getDbConfig() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not defined");
  }

  // For PostgreSQL URLs, we need to parse manually due to Node.js 24 URL parsing issues
  // Format: postgresql://user:password@host:port/database?params
  const withoutProtocol = url.replace(/^postgresql:\/\//, "");
  const atSignIndex = withoutProtocol.indexOf("@");
  const questionMarkIndex = withoutProtocol.indexOf("?");

  if (atSignIndex === -1) {
    throw new Error(`Invalid DATABASE_URL: no @ found in ${url}`);
  }

  // Extract credentials
  const credentials = withoutProtocol.slice(0, atSignIndex);
  const colonIndex = credentials.indexOf(":");
  if (colonIndex === -1) {
    throw new Error(`Invalid DATABASE_URL: no : found in credentials ${url}`);
  }
  const user = decodeURIComponent(credentials.slice(0, colonIndex));
  const password = decodeURIComponent(credentials.slice(colonIndex + 1));

  // Extract host, port, database
  const afterAt = withoutProtocol.slice(atSignIndex + 1);
  const slashIndex = afterAt.indexOf("/");
  const hostPort = slashIndex === -1 ? afterAt : afterAt.slice(0, slashIndex);
  const database =
    slashIndex === -1 ? "" : afterAt.slice(slashIndex + 1).split("?")[0];

  // Parse host and port
  const hostColonIndex = hostPort.lastIndexOf(":");
  let host: string;
  let port: number;
  if (hostColonIndex === -1) {
    host = hostPort;
    port = 5432;
  } else {
    host = hostPort.slice(0, hostColonIndex);
    port = Number(hostPort.slice(hostColonIndex + 1));
  }

  // Check for SSL
  const hasSsl =
    questionMarkIndex !== -1 &&
    afterAt.slice(questionMarkIndex).includes("sslmode=require");

  return {
    database,
    host,
    password,
    port: port || 5432,
    ssl: hasSsl ? { rejectUnauthorized: false } : undefined,
    user,
  };
}

/**
 * Database connection pool configured for Next.js and Neon PostgreSQL.
 */
const pool = new Pool(getDbConfig());

/**
 * Drizzle ORM instance with the configured pool.
 */
export const db = drizzle(pool);
