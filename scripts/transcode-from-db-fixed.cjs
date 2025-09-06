#!/usr/bin/env node
// Lightweight compatibility shim for ffmpeg in transcode scripts.
// Strategy:
// 1. Respect process.env.FFMPEG_BIN if set.
// 2. Try to use the bundled binary from `ffmpeg-static` (if installed).
// 3. Fall back to system `ffmpeg` found via `where` (Windows) or `which` (other OS).
// 4. Monkey-patch child_process.spawnSync so existing code that calls `spawnSync('ffmpeg', ...)`
//    will be redirected to the resolved ffmpeg binary.

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

function resolveFfmpeg() {
	// 1) explicit env override
	if (process.env.FFMPEG_BIN && process.env.FFMPEG_BIN.trim()) {
		return process.env.FFMPEG_BIN.trim();
	}

	// 2) try ffmpeg-static package
	try {
		// require may throw if module not installed
		const ff = require('ffmpeg-static');
		if (ff && typeof ff === 'string') return ff;
	} catch (e) {
		// ignore
	}

	// 3) try system discovery (where on Windows, which on POSIX)
	try {
		const isWin = process.platform === 'win32';
		if (isWin) {
			const r = child_process.spawnSync('where', ['ffmpeg'], { encoding: 'utf8' });
			if (r.status === 0 && r.stdout) {
				const p = r.stdout.split(/\r?\n/).find(Boolean);
				if (p) return p.trim();
			}
		} else {
			const r = child_process.spawnSync('which', ['ffmpeg'], { encoding: 'utf8' });
			if (r.status === 0 && r.stdout) {
				const p = r.stdout.split(/\r?\n/).find(Boolean);
				if (p) return p.trim();
			}
		}
	} catch (e) {
		// ignore
	}

	return null;
}

const ffmpegPath = resolveFfmpeg();

if (!ffmpegPath) {
	console.error('\nERROR: ffmpeg not found.');
	console.error('Options to fix this:');
	console.error('  1) Install ffmpeg system-wide and add it to your PATH (restart shell).');
	console.error('  2) Install a bundled binary in this project: `npm install --save-dev ffmpeg-static`');
	console.error('  3) Or set environment variable FFMPEG_BIN to the full ffmpeg executable path.');
	console.error('\nIf you install `ffmpeg-static`, the script will automatically use it.');
	// Do not exit immediately to allow existing scripts to show the same error, but exit with non-zero code.
	process.exitCode = 1;
} else {
	// Monkey-patch spawnSync to rewrite 'ffmpeg' to resolved path.
	const origSpawnSync = child_process.spawnSync;
	child_process.spawnSync = function (cmd, args, opts) {
		if (cmd === 'ffmpeg' || cmd === 'ffmpeg.exe') {
			cmd = ffmpegPath;
		}
		return origSpawnSync.call(child_process, cmd, args, opts);
	};

	// Verify ffmpeg runs
	try {
		const v = child_process.spawnSync(ffmpegPath, ['-version'], { encoding: 'utf8' });
		if (v.status === 0) {
			console.log('Using ffmpeg:', ffmpegPath);
		} else {
			console.error('Found ffmpeg at', ffmpegPath, 'but failed to execute - status', v.status);
			console.error('stderr:', v.stderr);
			process.exitCode = 1;
		}
	} catch (err) {
		console.error('Error executing ffmpeg at', ffmpegPath, err && err.message);
		process.exitCode = 1;
	}
}

// If there is an existing transcode script next to this shim, require it so it runs with the patched spawnSync.
const originalScript = path.join(__dirname, 'transcode-from-db.cjs');
if (fs.existsSync(originalScript) && fs.statSync(originalScript).size > 0) {
	// Load the original script file in this process (it will use the patched spawnSync)
	try {
		require(originalScript);
	} catch (err) {
		console.error('Error running original transcode script:', err && err.stack ? err.stack : err);
		process.exitCode = 1;
	}
} else {
	console.log('Note: no original transcode-from-db.cjs found or file is empty.');
	console.log('This shim ensures ffmpeg is discovered for scripts that call spawnSync("ffmpeg", ...)');
	console.log('Install `ffmpeg-static` or a system ffmpeg and re-run your transcode script.');
}

