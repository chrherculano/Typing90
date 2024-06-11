const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');
const helmet = require('helmet');

const app = express();
const PORT = 3000;

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/quotes', (req, res) => {
  db.all('SELECT text FROM quotes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      quotes: rows.map(row => row.text)
    });
  });
});

app.post('/api/scores', (req, res) => {
  const { player_name, score } = req.body;
  const stmt = db.prepare("INSERT INTO scores (player_name, score) VALUES (?, ?)");
  stmt.run(player_name, score, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
