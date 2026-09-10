import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// A single global connection in dev avoids exhausting the connection pool
// on every hot reload. The client is created lazily so that `next build`
// (which imports this module to collect route metadata) doesn't require
// DATABASE_URL to be set — only actually running the app does.
const globalForDb = globalThis as unknown as {
  queryClient?: ReturnType<typeof postgres>;
  drizzleDb?: ReturnType<typeof drizzle<typeof schema>>;
};

function getDb() {
  if (!globalForDb.drizzleDb) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set");
    }
    const client =
      globalForDb.queryClient ?? postgres(connectionString, { max: 5 });
    const instance = drizzle(client, { schema });
    if (process.env.NODE_ENV !== "production") {
      globalForDb.queryClient = client;
    }
    globalForDb.drizzleDb = instance;
  }
  return globalForDb.drizzleDb;
}

export const db: ReturnType<typeof drizzle<typeof schema>> = new Proxy(
  {} as ReturnType<typeof drizzle<typeof schema>>,
  {
    get(_target, prop, receiver) {
      return Reflect.get(getDb(), prop, receiver);
    },
  }
);
