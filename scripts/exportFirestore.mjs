import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- Configuration ----
// Collections to export for judges / reviewers
const COLLECTIONS = ['users', 'campaigns', 'donations', 'expenses', 'contact_requests'];
const OUTPUT_DIR = path.join(__dirname, '..', 'exports');

// Initialise Firebase Admin using either GOOGLE_APPLICATION_CREDENTIALS
// or a local serviceAccountKey.json (NOT committed to Git)
function initFirebaseAdmin() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('Using GOOGLE_APPLICATION_CREDENTIALS to authenticate with Firebase Admin...');
    initializeApp({
      credential: applicationDefault()
    });
    return;
  }

  const localKeyPath = path.join(__dirname, '..', 'serviceAccountKey.json');
  if (fs.existsSync(localKeyPath)) {
    console.log('Using local serviceAccountKey.json to authenticate with Firebase Admin...');
    const serviceAccount = JSON.parse(fs.readFileSync(localKeyPath, 'utf8'));
    initializeApp({
      credential: cert(serviceAccount)
    });
    return;
  }

  console.error(
    '\n❌ No Firebase Admin credentials found.\n' +
      'Please either:\n' +
      '  1) Set GOOGLE_APPLICATION_CREDENTIALS to your service account key path, OR\n' +
      '  2) Save your service account JSON as "serviceAccountKey.json" in the project root (and keep it out of Git).\n'
  );
  process.exit(1);
}

async function exportCollections() {
  initFirebaseAdmin();
  const db = getFirestore();

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log(`\n📤 Starting Firestore export for collections: ${COLLECTIONS.join(', ')}`);

  for (const name of COLLECTIONS) {
    try {
      const snapshot = await db.collection(name).get();
      const records = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        // Convert Firestore Timestamp objects into ISO strings for readability
        const serialised = {};
        for (const [key, value] of Object.entries(data)) {
          if (value && typeof value.toDate === 'function') {
            serialised[key] = value.toDate().toISOString();
          } else {
            serialised[key] = value;
          }
        }

        records.push({ id: doc.id, ...serialised });
      });

      const outPath = path.join(OUTPUT_DIR, `${name}.json`);
      fs.writeFileSync(outPath, JSON.stringify(records, null, 2), 'utf8');
      console.log(`✅ Exported ${records.length} documents from "${name}" to ${path.relative(process.cwd(), outPath)}`);
    } catch (err) {
      console.error(`❌ Failed to export collection "${name}":`, err.message);
    }
  }

  console.log('\n✨ Export completed. JSON files are available in the "exports" folder.\n');
  process.exit(0);
}

exportCollections().catch((err) => {
  console.error('Unexpected error during export:', err);
  process.exit(1);
});

