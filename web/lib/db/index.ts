import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

const sql = neon(databaseUrl!);
export const db = drizzle(sql, { schema });

