#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function log(...a) { console.log('[export-videos]', ...a); }

async function fetchRows(client, table, columns) {
  const { data, error } = await client.from(table).select(columns.join(','));
  if (error) throw error;
  return data || [];
}

async function main() {
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Require SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env');
    process.exit(1);
  }

  const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  const outDir = path.join(process.cwd(), 'outputs');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'updated-videos.csv');

  const tables = [
    { name: 'booms', cols: ['id', 'video_url', 'thumbnail_url', 'poster_url'] },
    { name: 'fulltime', cols: ['id', 'video_url', 'thumbnail_url', 'duration'] },
  ];

  const rowsOut = [];
  for (const t of tables) {
    log('Querying', t.name);
    const rows = await fetchRows(client, t.name, t.cols);
    for (const r of rows) {
      rowsOut.push({ table: t.name, id: r.id, video_url: r.video_url || '', thumbnail_url: r.thumbnail_url || '', extra: r.poster_url || r.duration || '' });
    }
  }

  // Write CSV header
  const header = ['table', 'id', 'video_url', 'thumbnail_url', 'extra'];
  const out = [header.join(',')];
  for (const r of rowsOut) {
    // simple CSV escaping of quotes
    const vals = header.map((h) => (`"${String(r[h] || '').replace(/"/g, '""')}"`));
    out.push(vals.join(','));
  }

  fs.writeFileSync(outPath, out.join('\n'));
  log('Wrote', outPath, 'with', rowsOut.length, 'rows');
  console.log(outPath);
}

if (require.main === module) main();
