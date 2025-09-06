#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const os = require('os');
const child_process = require('child_process');

// Use @supabase/supabase-js to query DB. Requires SUPABASE_URL and SUPABASE_ANON_KEY in env.
const { createClient } = require('@supabase/supabase-js');

const TEMP_DIR = path.join(os.tmpdir(), 'dozur-transcode');
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });

function log(...args) { console.log('[transcode]', ...args); }

async function downloadToFile(url, dest) {
	return new Promise((resolve, reject) => {
		const proto = url.startsWith('https') ? require('https') : require('http');
		const file = fs.createWriteStream(dest);
		const req = proto.get(url, (res) => {
			if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode));
			res.pipe(file);
			file.on('finish', () => file.close(() => resolve(dest)));
		});
		req.on('error', (err) => {
			fs.unlink(dest, () => reject(err));
		});
	});
}

function transcode(input, output) {
	const args = [
		'-y',
		'-i', input,
		'-vf', 'scale=540:-2',
		'-c:v', 'libx264',
		'-profile:v', 'main',
		'-preset', 'fast',
		'-crf', '25',
		'-pix_fmt', 'yuv420p',
		'-c:a', 'aac',
		'-b:a', '64k',
		'-ac', '1',
		'-ar', '22050',
		'-movflags', '+faststart',
		output,
	];

	log('ffmpeg', args.join(' '));
	const r = child_process.spawnSync('ffmpeg', args, { stdio: 'inherit' });
	if (r.error) throw r.error;
	if (r.status !== 0) throw new Error('ffmpeg exited with status ' + r.status);
}

async function processTable(supabase, adminSupabase, table, column, overrideUpdateColumn) {
	log('Querying table:', table);
	// Determine which candidate mobile columns actually exist in the table
	const candidateCols = ['mobile_url', 'video_mobile_url', 'mobile_video_url'];
	// Only select rows where video_url IS NULL and original_url IS NOT NULL (new uploads needing processing)
	const selectCols = ['id', 'original_url', column].join(', ');
	const { data, error } = await supabase
		.from(table)
		.select(selectCols)
		.is(column, null)
		.not('original_url', 'is', null);
	if (error) throw error;
	const rows = data || [];
	log(`[${table}] Found ${rows.length} new rows needing processing (video_url is NULL, original_url is NOT NULL)`);

	async function processRow(table, id) {
		// Reuse the same logic used inside the loop for a single row id
		const infoClient = adminSupabase || supabase;
		let fullRow = null;
		try {
			const { data: fullData, error: fullErr } = await infoClient.from(table).select('*').eq('id', id).limit(1).single();
			if (fullErr) throw fullErr;
			fullRow = fullData || {};
		} catch (e) {
			log(`[${table}] Could not fetch full row ${id} for inspection:`, e && e.message ? e.message : e);
			fullRow = null;
		}

	// Use original_url as the source for transcoding
	const url = fullRow ? fullRow['original_url'] : null;
		const detectedMobileCols = fullRow ? candidateCols.filter((c) => Object.prototype.hasOwnProperty.call(fullRow, c)) : [];
		if (detectedMobileCols.some((c) => fullRow && fullRow[c])) {
			log(`[${table}] Skipping ${id} - mobile URL already present in one of: ${detectedMobileCols.join(', ')}`);
			return { skipped: true };
		}
		if (!url) {
			log(`[${table}] Row ${id} has no source URL in column ${column}; skipping`);
			return { skipped: true };
		}
		try {
			log(`[${table}] Downloading row ${id} from ${url}`);
			const safeName = (path.basename(url).replace(/[^a-zA-Z0-9_.-]/g, '_') || id);
			const inPath = path.join(TEMP_DIR, `${safeName}-${Date.now()}.mp4`);
			await downloadToFile(url, inPath);
			const outPath = path.join(TEMP_DIR, `${safeName}-mobile-${Date.now()}.mp4`);
			log(`[${table}] Transcoding row ${id}`);
			transcode(inPath, outPath);
			const bucketMatch = /\/object\/public\/([^\/]+)\/(.+)$/.exec(url);
			if (bucketMatch) {
				const bucket = bucketMatch[1];
				const origPath = bucketMatch[2];
				const mobilePath = `mobile/${safeName}-mobile-${Date.now()}.mp4`;
				log(`[${table}] Uploading to bucket ${bucket} at ${mobilePath}`);
				try {
					const fileBuffer = fs.readFileSync(outPath);
					const storageClient = adminSupabase || supabase;
					if (!adminSupabase) log(`[${table}] Warning: SUPABASE_SERVICE_ROLE_KEY not provided - uploads may fail due to RLS`);
					const { data: upData, error: upErr } = await storageClient.storage.from(bucket).upload(mobilePath, fileBuffer, { upsert: true, contentType: 'video/mp4' });
					if (upErr) throw upErr;
					const { data: pub } = await supabase.storage.from(bucket).getPublicUrl(mobilePath);
					const publicUrl = pub?.publicUrl || null;
					if (!publicUrl) throw new Error('Failed to obtain public URL after upload');
					log(`[${table}] Uploaded and public at ${publicUrl}`);
					let updated = false;
					const updateClient = adminSupabase || supabase;
					if (overrideUpdateColumn) {
						if (!fullRow || !Object.prototype.hasOwnProperty.call(fullRow, overrideUpdateColumn)) {
							log(`[${table}] Override update column '${overrideUpdateColumn}' does not exist in table; skipping update attempt`);
						} else {
							const { data: updData, error: updErr } = await updateClient.from(table).update({ [overrideUpdateColumn]: publicUrl }).eq('id', id).select();
							if (!updErr) {
								log(`[${table}] Updated row ${id} column ${overrideUpdateColumn}`);
								updated = true;
							} else {
								log(`[${table}] Could not update override column ${overrideUpdateColumn} for ${id}: ${updErr && updErr.message}`);
							}
						}
					}
					if (!updated && detectedMobileCols.length) {
						for (const colName of detectedMobileCols) {
							const { data: updData, error: updErr } = await updateClient.from(table).update({ [colName]: publicUrl }).eq('id', id).select();
							if (!updErr) {
								log(`[${table}] Updated row ${id} column ${colName}`);
								updated = true;
								break;
							}
							log(`[${table}] Could not update column ${colName} for ${id}: ${updErr && updErr.message}`);
						}
					}
					if (!updated) log(`[${table}] Warning: unable to update any mobile URL column for row ${id}`);
				} catch (err) {
					log(`[${table}] Upload error for row ${id}:`, err && err.message ? err.message : err);
					return { error: err };
				}
			} else {
				log(`[${table}] Could not parse bucket from URL, skipping upload for row ${id}`);
				return { skipped: true };
			}
			log(`[${table}] Done: ${outPath}`);
			return { ok: true };
		} catch (err) {
			log('Error processing row', id, ':', err && err.message ? err.message : err);
			return { error: err };
		}
	}

	// Use the new processRow for existing processTable loop
	for (const row of rows) {
		await processRow(table, row.id);
	}

	// Export processRow so other scripts (worker) can call it
	module.exports = module.exports || {};
	module.exports.processRow = processRow;
}

async function main() {
	const SUPABASE_URL = process.env.SUPABASE_URL;
	const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
		console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in env.');
		process.exit(1);
	}

	const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		auth: { persistSession: false },
	});
	const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
	let adminSupabase = null;
	if (SUPABASE_SERVICE_ROLE_KEY) {
		adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
		log('Using SUPABASE_SERVICE_ROLE_KEY for uploads/updates to bypass RLS');
	}

	try {
	// For these tables, process only new uploads (video_url is NULL, original_url is NOT NULL)
	await processTable(supabase, adminSupabase, 'booms', 'video_url', 'video_url');
	await processTable(supabase, adminSupabase, 'fulltime', 'video_url', 'video_url');
	} catch (err) {
		console.error('Fatal error:', err && err.stack ? err.stack : err);
		process.exit(1);
	}

	log('All tables processed');
}

// Run when required or executed directly
if (require.main === module) {
	main();
} else {
	main();
}

