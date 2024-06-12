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
      scriptSrcAttr: ["'self'", "'unsafe-inline'"], // Permitir atributos de script
      upgradeInsecureRequests: [],
    },
  })
);

app.use(bodyParser.json());
app.use(express.static('public'));

// Defina seus endpoints aqui
// Exemplo:
app.get('/api/quotes', (req, res) => {
  const query = `
    SELECT quotes.text, authors.name AS author 
    FROM quotes 
    JOIN authors 
    ON quotes.author_id = authors.id
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      quotes: rows
    });
  });
});

// Endpoint para buscar os top scores
app.get('/api/topscores', (req, res) => {
  const query = `
    SELECT player_name, score 
    FROM scores 
    ORDER BY score DESC 
    LIMIT 10
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ topscores: rows });
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
