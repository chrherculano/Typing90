const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Caminho relativo para o arquivo do banco de dados
const dbPath = path.join(__dirname, 'type90.db');

// Remova o banco de dados existente, se houver
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log(`Banco de dados existente removido: ${dbPath}`);
}

// Cria um novo banco de dados SQLite físico
const db = new sqlite3.Database(dbPath);

// Criar tabelas e inserir dados de exemplo
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS authors (id INTEGER PRIMARY KEY, name TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY, text TEXT, author_id INTEGER, FOREIGN KEY(author_id) REFERENCES authors(id))");
  db.run("CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY, player_name TEXT, score INTEGER)");

  const authors = [
    "William Shakespeare",
    "Albert Einstein",
    "Mark Twain",
    "Oscar Wilde",
    "Friedrich Nietzsche",
    "Platão",
    "Aristóteles",
    "Sócrates",
    "Leonardo da Vinci",
    "Confúcio",
    "Sun Tzu",
    "Napoleão Bonaparte",
    "Mahatma Gandhi",
    "Winston Churchill",
    "Martin Luther King Jr.",
    "Nelson Mandela",
    "Madre Teresa",
    "Benjamin Franklin",
    "Thomas Edison",
    "Alexandre, o Grande"
  ];

  const quotes = [
    "Ser ou não ser, eis a questão",
    "A vida é como andar de bicicleta. Para manter o equilíbrio, você deve continuar se movendo",
    "O segredo para avançar é começar",
    "Seja você mesmo; todos os outros já existem",
    "O que não nos mata nos torna mais fortes",
    "O começo é a parte mais importante do trabalho",
    "Nós somos o que repetidamente fazemos. A excelência, então, não é um ato, mas um hábito",
    "A única verdadeira sabedoria está em saber que você nada sabe",
    "Aprender nunca cansa a mente",
    "Não importa o quão devagar você vá, desde que você não pare",
    "A suprema arte da guerra é derrotar o inimigo sem lutar",
    "A vitória pertence aos mais perseverantes",
    "A melhor maneira de encontrar a si mesmo é se perder no serviço dos outros",
    "O sucesso não é definitivo, o fracasso não é fatal: é a coragem de continuar que conta",
    "A injustiça em qualquer lugar é uma ameaça à justiça em todo lugar",
    "Parece sempre impossível até que seja feito",
    "Espalhe amor por onde você for. Que ninguém venha a você sem sair mais feliz",
    "Diga-me e eu esqueço. Ensine-me e eu lembro. Envolva-me e eu aprendo",
    "O gênio é 1% de inspiração e 99% de transpiração",
    "Não tenho medo de um exército de leões liderados por uma ovelha; tenho medo de um exército de ovelhas lideradas por um leão"
  ];

  const authorStmt = db.prepare("INSERT INTO authors (name) VALUES (?)");
  const quoteStmt = db.prepare("INSERT INTO quotes (text, author_id) VALUES (?, ?)");

  authors.forEach((author, index) => {
    authorStmt.run(author, function () {
      const authorId = this.lastID;
      quoteStmt.run(quotes[index], authorId, function() {
        if (index === authors.length - 1) {
          quoteStmt.finalize();
        }
      });
    });
  });
  
  authorStmt.finalize();
});

module.exports = db;
