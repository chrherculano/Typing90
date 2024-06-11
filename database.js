const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

// Criar tabelas e inserir dados de exemplo
db.serialize(() => {
  db.run("CREATE TABLE quotes (id INTEGER PRIMARY KEY, text TEXT)");
  db.run("CREATE TABLE scores (id INTEGER PRIMARY KEY, player_name TEXT, score INTEGER)");

  const stmt = db.prepare("INSERT INTO quotes (text) VALUES (?)");
  const quotes = [
    "Ser ou não ser, eis a questão",
    "O gênio é um por cento de inspiração e noventa e nove por cento de transpiração",
    "Nem todos os que vagam estão perdidos",
    "Você perde 100% dos chutes que não dá",
    "Seja a mudança que você deseja ver no mundo",
    "A única maneira de fazer um grande trabalho é amar o que você faz",
    "Você pode observar muito apenas observando",
    "Acredite que você pode e você já está no meio do caminho",
    "Dança Gatinho dança",
    "Não levante a espada sobre a cabeça de quem te pediu perdão",
    "Desistir é para os fracos! Faça que nem eu, nem tente",
    "Creia em si, mas não duvide sempre dos outros",
    "A vida sem luta é um mar morto no centro do organismo universal",
    "A mentira é muita vezes tão involuntária como a respiração",
    "Não se ama duas vezes a mesma mulher",
    "O medo é um preconceito dos nervos. E um preconceito, desfaz-se; basta a simples reflexão",
    "A moral é uma, os pecados são diferentes",
    "Quanto a mim, tudo que eu sei é que eu não sei nada",
    "O pouco que aprendi até agora é quase nada, comparado ao que ignoro",
    "A saudade é o que faz as coisas pararem no tempo"
  ];

  quotes.forEach(quote => {
    stmt.run(quote);
  });

  stmt.finalize();
});

module.exports = db;
