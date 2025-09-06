/* eslint-disable */
const fs = require('fs');
const path = require('path');

const marker = path.join(__dirname, '..', 'tmp', 'worker-alive');
if (fs.existsSync(marker)) {
  console.log('OK');
  process.exit(0);
} else {
  console.error('NO_MARKER');
  process.exit(2);
}
