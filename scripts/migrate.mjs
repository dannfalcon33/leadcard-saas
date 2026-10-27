import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const envFiles = ['.env.local', '.env'];
let dbUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!dbUrl) {
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const unpooledMatch = content.match(/DATABASE_URL_UNPOOLED=["']?([^"'\r\n]+)["']?/);
      const regularMatch = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (unpooledMatch) {
        dbUrl = unpooledMatch[1];
        break;
      } else if (regularMatch) {
        dbUrl = regularMatch[1];
        break;
      }
    }
  }
}

if (!dbUrl) {
  console.error("No database URL found in environment or .env/.env.local");
  process.exit(1);
}

const sql = neon(dbUrl);
const schemaSql = fs.readFileSync(path.resolve(process.cwd(), 'schema.neon.sql'), 'utf8');

// Parse individual statements
function splitStatements(sqlText) {
  // Remove block and line comments
  const cleanSql = sqlText
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--.*$/gm, '');

  return cleanSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

async function migrate() {
  console.log("Applying Neon schema migrations...");
  const statements = splitStatements(schemaSql);

  try {
    for (const stmt of statements) {
      await sql.query(stmt);
    }
    console.log("All schema statements applied successfully!");

    // Verify created tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    console.log("Current tables in public schema:", tables.map(t => t.table_name));
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
