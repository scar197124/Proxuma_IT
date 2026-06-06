const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const appCode = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const apiPath = path.join(root, 'api', 'proxuma-rdap.js');
const apiCode = fs.readFileSync(apiPath, 'utf8');
const vercelConfig = fs.readFileSync(path.join(root, 'vercel.json'), 'utf8');

assert(fs.existsSync(apiPath), 'Vercel RDAP API route should exist');
assert(apiCode.includes('rdap.org/domain'), 'RDAP bridge should use rdap.org domain endpoint');
assert(apiCode.includes('normalizeDomain'), 'RDAP bridge should normalize domains');
assert(apiCode.includes('isValidDomain'), 'RDAP bridge should validate domains');
assert(apiCode.includes('Cache-Control'), 'RDAP bridge should set no-store cache header');
assert(apiCode.includes('No hidden') || apiCode.includes('Do not call this automatically'), 'API file should document no automatic frontend usage');
assert(vercelConfig.includes('api/proxuma-rdap.js'), 'vercel.json should register the RDAP function');
assert(((appCode.match(/fetch\s*\(/g)||[]).length <= 1) && appCode.includes('runConsentGatedRdapLookup'), 'static frontend should only contain the explicit consent-gated RDAP fetch');
assert(appCode.includes('makeLocalRdapEndpoint') && appCode.includes('/api/proxuma-rdap?domain='), 'static frontend should call the RDAP bridge only through the consent-gated endpoint helper');

const bridge = require(apiPath)._test;
assert.strictEqual(bridge.normalizeDomain('https://www.Example.com/path?q=1'), 'example.com', 'normalizeDomain should extract clean host from URL');
assert.strictEqual(bridge.isValidDomain('example.com'), true, 'valid domain should pass');
assert.strictEqual(bridge.isValidDomain('ronaldbank,com'), false, 'comma-domain should not be accepted by serverless lookup');
assert.strictEqual(bridge.isValidDomain('bad_domain.com'), false, 'underscore domain should not be accepted');
assert.strictEqual(bridge.isValidDomain('localhost'), false, 'single-label host should not be accepted');

console.log('v3.29.0 Vercel RDAP bridge prototype tests passed');
