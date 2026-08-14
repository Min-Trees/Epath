// Validates firestore.rules against the expected access patterns using the
// Firebase Emulator. Run with:
//
//   npx firebase emulators:exec --only firestore --config firebase.json \
//     "node tests/firestore-rules.test.cjs"
//
// The script exits with a non-zero status if any expectation fails.
const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require('@firebase/rules-unit-testing');
const fs = require('node:fs');
const path = require('node:path');

const RULES = fs.readFileSync(
  path.join(__dirname, '..', 'firestore.rules'),
  'utf8'
);

const projectId = 'demo-epath-rules';

(async () => {
  const env = await initializeTestEnvironment({
    projectId,
    firestore: { rules: RULES, host: '127.0.0.1', port: 8080 },
  });

  const failures = [];
  const check = async (label, fn) => {
    try {
      await fn();
      console.log(`  ok   ${label}`);
    } catch (err) {
      failures.push(`  FAIL ${label}: ${err.message}`);
      console.log(`  FAIL ${label}`);
    }
  };

  // Seed a pair of documents: one active, one inactive, on a collection
  // we know the rules expose to the public.
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await db.collection('faqs').doc('a1').set({
      question: { vi: '?', en: '?' },
      answer: { vi: '!', en: '!' },
      category: 'general',
      order: 0,
      isActive: true,
    });
    await db.collection('faqs').doc('a2').set({
      question: { vi: '?', en: '?' },
      answer: { vi: '!', en: '!' },
      category: 'general',
      order: 1,
      isActive: false,
    });
    await db.collection('programs').doc('p1').set({
      slug: 'demo',
      level: 'elementary',
      title: { vi: 't', en: 't' },
      shortDescription: { vi: 's', en: 's' },
      content: { vi: 'c', en: 'c' },
      order: 0,
      isActive: true,
      status: 'published',
    });
    await db.collection('programs').doc('p2').set({
      slug: 'demo2',
      level: 'elementary',
      title: { vi: 't', en: 't' },
      shortDescription: { vi: 's', en: 's' },
      content: { vi: 'c', en: 'c' },
      order: 1,
      isActive: true,
      status: 'draft',
    });
    await db.collection('chatbotLeads').doc('cl1').set({ email: 'x@y.z' });
  });

  // Helper: each call returns a fresh, isolated Firestore client bound to
  // a new context, so we don't share a single client across tests (which
  // causes "Firestore has already been started" errors).
  const publicDb = () => env.unauthenticatedContext().firestore();

  console.log('public read rules');
  await check('public can read active faqs', async () => {
    await assertSucceeds(publicDb().collection('faqs').doc('a1').get());
  });
  await check('public cannot read inactive faqs', async () => {
    await assertFails(publicDb().collection('faqs').doc('a2').get());
  });
  await check('public cannot read draft programs', async () => {
    await assertFails(publicDb().collection('programs').doc('p2').get());
  });
  await check('public can read published+active programs', async () => {
    await assertSucceeds(publicDb().collection('programs').doc('p1').get());
  });
  await check('public cannot write faqs', async () => {
    await assertFails(
      publicDb().collection('faqs').doc('new').set({ isActive: true })
    );
  });
  await check('public cannot read chatbotLeads', async () => {
    await assertFails(publicDb().collection('chatbotLeads').doc('cl1').get());
  });

  await env.cleanup();

  if (failures.length) {
    console.error('\nFailures:');
    for (const f of failures) console.error(f);
    process.exit(1);
  }
  console.log('\nAll rule checks passed.');
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
