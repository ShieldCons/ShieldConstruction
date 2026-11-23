const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const vm = require('node:vm');

const siteScript = readFileSync(join(__dirname, '../js/main.js'), 'utf8');

function submitWith(response, configured = true) {
  const window = { SITE_CONFIG: configured ? { GOOGLE_SCRIPT_URL: 'https://script.google.com/test' } : {} };
  vm.runInNewContext(siteScript, {
    window,
    document: { addEventListener() {} },
    fetch: async () => response,
    console,
    setTimeout
  });
  return window.submitToGoogleSheet({ formType: 'request-inspection' });
}

test('acknowledges the receipt returned after Apps Script writes the lead', async () => {
  const result = await submitWith(new Response('{"ok":true}'));
  assert.equal(result.ok, true);
});

for (const [name, body, status] of [
  ['HTML login page', '<html>Sign in</html>', 200],
  ['empty response', '', 200],
  ['invalid JSON', '{', 200],
  ['missing confirmation', '{}', 200],
  ['string confirmation', '{"ok":"true"}', 200],
  ['skipped submission', '{"ok":true,"skipped":"honeypot"}', 200],
  ['endpoint health check', '{"ok":true,"message":"Shield Construction form endpoint is running."}', 200],
  ['unsuccessful HTTP status', '{"ok":true}', 500]
]) {
  test(name + ' cannot confirm receipt', async () => {
    const confirmed = await submitWith(new Response(body, { status })).then(result => result?.ok === true, () => false);
    assert.equal(confirmed, false);
  });
}

test('a missing endpoint cannot confirm receipt', async () => {
  const confirmed = await submitWith(null, false).then(result => result?.ok === true, () => false);
  assert.equal(confirmed, false);
});

test('retains the backend rate-limit message', async () => {
  const result = await submitWith(new Response('{"ok":false,"error":"rate_limit","message":"Please wait."}'));
  assert.equal(result.ok, false);
  assert.equal(result.error, 'rate_limit');
  assert.equal(result.message, 'Please wait.');
});
