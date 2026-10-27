import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

// Check for .env.local or .env
const envFiles = ['.env.local', '.env'];
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const match = content.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
      if (match) {
        databaseUrl = match[1];
        break;
      }
    }
  }
}

if (!databaseUrl) {
  console.error('Error: DATABASE_URL not found in environment or .env/.env.local');
  process.exit(1);
}

const sql = neon(databaseUrl);

try {
  const result = await sql`SELECT 
    version() as pg_version, 
    current_database() as database, 
    current_user as user,
    now() as server_time;`;

  console.log('Neon Database Connection: OK');
  console.log(result[0]);

  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;
  console.log('Tables in public schema:', tables.map(t => t.table_name));
} catch (error) {
  console.error('Failed to query Neon database:', error);
  process.exit(1);
}
