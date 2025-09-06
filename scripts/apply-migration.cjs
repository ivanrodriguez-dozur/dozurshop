#!/usr/bin/env node
const { Client } = require('pg');

async function run() {
  const conn = process.env.PGCONN || process.argv[2];
  if (!conn) {
    console.error('Usage: PGCONN="postgres://..." node scripts/apply-migration.cjs');
    process.exit(1);
  }
  const client = new Client({ connectionString: conn, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    console.log('[migrate] Connected, applying alters');
    const sqls = [
      "ALTER TABLE IF EXISTS booms ADD COLUMN IF NOT EXISTS transcode_status TEXT;",
      "ALTER TABLE IF EXISTS fulltime ADD COLUMN IF NOT EXISTS transcode_status TEXT;",
    ];
    for (const s of sqls) {
      console.log('[migrate] Running:', s);
      await client.query(s);
    }
    console.log('[migrate] Migration applied successfully');
  } catch (e) {
    console.error('[migrate] Error:', e && e.message ? e.message : e);
    process.exitCode = 2;
  } finally {
    try { await client.end(); } catch (e) {}
  }
}

if (require.main === module) run();
