const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const code = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
function assert(condition, message){
  if(!condition){
    console.error('FAIL:', message);
    process.exit(1);
  }
}
assert(code.includes('v3.24.1 Domain Ending Spoof + Comma Domain Tuning'), 'trajectory marker should include v3.24.1 tuning');
assert(code.includes('function inspectDomainEndingSpoof'), 'domain ending spoof inspector should exist');
assert(code.includes('Comma-domain punctuation trick'), 'comma-domain signal should exist');
assert(code.includes('Dot-com ending lookalike'), 'dot-com lookalike signal should exist');
assert(/c0m\|c0n/.test(code), 'c0m/c0n pattern should be checked');
assert(code.includes('payloadEndingSpoof'), 'payload lane should check ending spoof patterns');
assert(code.includes('domainEndingSpoof'), 'URL/domain lane should check ending spoof patterns');
assert(code.includes('endingSpoof.active') && code.includes('tokenHits.push'), 'Link Anatomy should include ending-spoof risk tokens');
console.log('PASS v3.24.1 domain ending spoof + comma domain tuning');
