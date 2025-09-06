#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

// Worker that polls for rows that need transcoding and delegates to the existing script
// Usage: node ./scripts/worker.cjs [--intervalms=60000] [--once]

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in env.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
const adminSupabase = SUPABASE_SERVICE_ROLE_KEY ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } }) : null;

const argv = require('minimist')(process.argv.slice(2));
const intervalMs = parseInt(argv.intervalms || 10000, 10);
const runOnce = !!argv.once;

function log(...a) { console.log('[worker]', ...a); }

async function findPendingRows() {
  // We'll look for rows where video_url is null AND transcode_status IS NULL or 'pending'.
  const tables = ['booms', 'fulltime'];
  const pending = [];
  for (const t of tables) {
    try {
      // prefer adminSupabase to avoid RLS when selecting/updating status
      const client = adminSupabase || supabase;
      const { data, error } = await client.from(t).select('id, video_url, transcode_status').or('transcode_status.is.null,transcode_status.eq.pending').is('video_url', null).limit(50);
      if (error) {
        log(`Error querying ${t}:`, error.message || error);
        continue;
      }
      if (data && data.length) {
        for (const r of data) pending.push({ table: t, id: r.id });
      }
    } catch (e) {
      log('Query exception for', t, e && e.message ? e.message : e);
    }
  }
  return pending;
}

async function processOnce() {
  log('Scanning for pending rows');
  const pending = await findPendingRows();
  if (!pending.length) {
    log('No pending rows found');
    return;
  }
  log(`Found ${pending.length} pending rows — delegating to transcode script`);
        // Claim and process rows individually to avoid races
        const transcodeModule = require('./transcode-from-db.cjs');
        for (const row of pending) {
          try {
            const client = adminSupabase || supabase;
            await client.from(row.table).update({ transcode_status: 'processing' }).eq('id', row.id);
            try {
              // Always use 'original_url' as the source column
              const result = await transcodeModule.processRow(row.table, row.id, 'original_url');
              await client.from(row.table).update({ transcode_status: 'done' }).eq('id', row.id);
              log(`Row ${row.table}:${row.id} processed:`, result && result.ok ? 'OK' : result && result.skipped ? 'SKIPPED' : 'ERROR');
            } catch (e) {
              await client.from(row.table).update({ transcode_status: 'failed' }).eq('id', row.id);
              log(`Row ${row.table}:${row.id} failed:`, e && e.message ? e.message : e);
            }
          } catch (e) {
            log('Error processing pending row', row, e && e.message ? e.message : e);
          }
        }
}

async function loop() {
  await processOnce();
  if (runOnce) return;
  setInterval(async () => {
    try {
      await processOnce();
    } catch (e) {
      log('Worker error:', e && e.message ? e.message : e);
    }
  }, intervalMs);
}

if (require.main === module) {
  loop();
}
