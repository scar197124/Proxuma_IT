const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){ if(!condition){ console.error('FAIL:', message); process.exit(1); } }
assert(code.includes('v3.24.2 Red-Team Detection Tuning'), 'v3.24.2 trajectory marker should exist');
assert(code.includes('function extractBase64DecodedUrls'), 'base64 URL extractor should exist');
assert(code.includes('match(/[A-Za-z0-9+/]{24,}={0,2}/g)'), 'base64 extractor regex should not contain backspace word-boundary corruption');
assert(code.includes('decodedBase64Matches'), 'candidate extraction should include base64-decoded URLs');
assert(code.includes('normalizedCandidate.match(/\\.([a-z0-9-]{2,12})(?:$|[\\/?:#\\s])/i)'), 'ending spoof should inspect visible payload authority fallback');
assert(code.includes('score = Math.min(score, payloadEndingSpoof.kind === "comma-domain" ? 40 : 36);'), 'payload spoof score should lower safety and raise displayed risk');
console.log('PASS v3.24.2 red-team detection tuning checks');
