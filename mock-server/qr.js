const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const [eventId, envName = 'dev'] = process.argv.slice(2);

if (!eventId) {
  console.error(
    'Usage: yarn mock:qr <eventId> [dev|qa|uat|prod]   e.g. yarn mock:qr evt-001 qa',
  );
  process.exit(1);
}

const envFile = path.join(__dirname, '..', `.env.${envName}`);

if (!fs.existsSync(envFile)) {
  console.error(`No ${path.basename(envFile)} found. Copy .env.example first.`);
  process.exit(1);
}

const schemeLine = fs
  .readFileSync(envFile, 'utf8')
  .split('\n')
  .find(line => line.startsWith('DEEP_LINK_SCHEME='));
const scheme = schemeLine?.slice('DEEP_LINK_SCHEME='.length).trim();

if (!scheme) {
  console.error(`DEEP_LINK_SCHEME is missing in ${path.basename(envFile)}`);
  process.exit(1);
}

const { events } = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'),
);
const event = events.find(candidate => candidate.id === eventId);

if (!event) {
  console.error(`No event with id "${eventId}" in mock-server/db.json`);
  process.exit(1);
}

const payload = `${scheme}://event/${event.id}`;
const outputDir = path.join(__dirname, 'qr');
const outputFile = path.join(outputDir, `${event.id}-${envName}.png`);

fs.mkdirSync(outputDir, { recursive: true });

QRCode.toFile(outputFile, payload, { width: 512, margin: 2 })
  .then(() => {
    console.log(`${event.title}\n${payload}\nSaved ${outputFile}`);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
