const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(root, 'proxuma-it.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

assert(html.includes('Universal scanner input'), 'main scanner label should describe one universal input');
assert(html.includes('Paste a URL, IP, QR payload, message, or text snippet'), 'main input placeholder should cover URLs, IPs, QR payloads, messages, and snippets');
assert(html.includes('One input handles links, domains, IPs, decoded QR text, copied SMS/email content, and raw suspicious snippets.'), 'main helper note should explain the unified intake');
assert(html.includes('<span>QR text</span>'), 'accepted input chips should include QR text');
assert(!html.includes('manualPayloadInput'), 'second manual payload textarea should be removed');
assert(!html.includes('Manual Payload Helper'), 'manual payload helper card should be removed from public UI');
assert(!html.includes('loadManualPayloadButton'), 'manual payload load button should be removed');
assert(!html.includes('scanManualPayloadButton'), 'manual payload scan button should be removed');
assert(!html.includes('clearManualPayloadButton'), 'manual payload clear button should be removed');
assert(!js.includes('manualPayloadInput'), 'manual payload DOM refs should be removed from app JS');
assert(!js.includes('loadManualPayload('), 'manual payload loading function should be removed');
assert(css.includes('.unified-input-note'), 'unified input helper CSS should exist');
assert(css.includes('.input-type-chips'), 'accepted input chip CSS should exist');
assert(!css.includes('.manual-payload-card'), 'manual payload card CSS should be removed');

console.log('v3.22.1 unified scanner input checks passed');
