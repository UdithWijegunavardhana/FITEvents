const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');

const PORT = Number(process.env.MOCK_PORT) || 3001;
const MAX_DELAY_MS = 30000;
const TOKEN_PREFIX = 'fake-jwt-';
const HIDDEN_FIELDS = ['checkInCode', 'password'];

const { users = [], ...collections } = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'),
);

const server = jsonServer.create();
const router = jsonServer.router(collections);

function stripHidden(value) {
  if (Array.isArray(value)) {
    return value.map(stripHidden);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !HIDDEN_FIELDS.includes(key))
        .map(([key, entry]) => [key, stripHidden(entry)]),
    );
  }
  return value;
}

function findUserByToken(request) {
  const header = request.get('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token.startsWith(TOKEN_PREFIX)) {
    return undefined;
  }
  return users.find(user => user.id === token.slice(TOKEN_PREFIX.length));
}

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  const delay = Math.min(Number(req.query._delay) || 0, MAX_DELAY_MS);
  const shouldFail = req.query._fail !== undefined && req.query._fail !== '0';
  delete req.query._delay;
  delete req.query._fail;

  setTimeout(() => {
    if (shouldFail) {
      res.status(500).json({ message: 'Simulated server error' });
      return;
    }
    next();
  }, delay);
});

server.post('/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find(
    candidate => candidate.email === email && candidate.password === password,
  );
  if (!user) {
    res.status(401).json({ message: 'Invalid email or password' });
    return;
  }
  res.json({ token: `${TOKEN_PREFIX}${user.id}`, user: stripHidden(user) });
});

server.get('/auth/me', (req, res) => {
  const user = findUserByToken(req);
  if (!user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }
  res.json(stripHidden(user));
});

router.render = (req, res) => {
  if (res.statusCode === 404) {
    res.json({ message: 'Not found' });
    return;
  }
  res.jsonp(stripHidden(res.locals.data));
};

server.use(router);

server.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`FIT Events mock API running on http://localhost:${PORT}`);
});
