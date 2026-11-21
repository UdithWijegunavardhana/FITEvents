const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

const eventId = process.argv[2];

if (!eventId) {
  console.error('Usage: yarn mock:qr <eventId>   e.g. yarn mock:qr evt-001');
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

const payload = `fitevents://check-in?eventId=${event.id}&code=${event.checkInCode}`;
const outputDir = path.join(__dirname, 'qr');
const outputFile = path.join(outputDir, `${event.id}.png`);

fs.mkdirSync(outputDir, { recursive: true });

QRCode.toFile(outputFile, payload, { width: 512, margin: 2 })
  .then(() => {
    console.log(`${event.title}\n${payload}\nSaved ${outputFile}`);
  })
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  });
