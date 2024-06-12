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
  db.run("CREATE TABLE IF NOT EXISTS quotes (id INTEGER PRIMARY KEY, text TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY, player_name TEXT, score INTEGER)");

  const stmt = db.prepare("INSERT INTO quotes (text) VALUES (?)");
  const quotes = [
      "A persistência é o caminho do êxito",
    "O sucesso é a soma de pequenos esforços repetidos dia após dia",
    "Se você quer algo que nunca teve, você precisa fazer algo que nunca fez",
    "O que você faz hoje pode melhorar todos os amanhãs",
    "A vida é uma jornada, não um destino",
    "Faça o que você pode, com o que você tem, onde você está",
    "Acredite em si mesmo e tudo será possível",
    "Grandes mentes discutem ideias; mentes medianas discutem eventos; mentes pequenas discutem pessoas",
    "A melhor maneira de prever o futuro é criá-lo",
    "Seja a mudança que você deseja ver no mundo",
    "Quanto mais você se esforça, mais sorte você tem",
    "A educação é a arma mais poderosa que você pode usar para mudar o mundo",
    "A única maneira de fazer um excelente trabalho é amar o que você faz",
    "Nada é impossível, a palavra em si diz 'eu sou possível'",
    "Nossas vidas começam a terminar no dia em que permanecemos em silêncio sobre as coisas que importam",
    "Não espere por uma crise para descobrir o que é importante em sua vida",
    "A vida é uma viagem, não um destino",
    "A única maneira de alcançar o impossível é acreditar que é possível",
    "O segredo para começar é dividir as tarefas árduas e complexas em pequenas tarefas gerenciáveis e, em seguida, começar na primeira",
    "Se você está atravessando o inferno, continue",
    "Se você quer ir rápido, vá sozinho. Se você quer ir longe, vá junto",
    "A vida é 10% do que acontece com você e 90% como você reage a isso",
    "O sucesso não é definitivo, o fracasso não é fatal: é a coragem de continuar que conta",
    "Nunca desista de um sonho apenas por causa do tempo que levará para realizá-lo. O tempo passará de qualquer maneira",
    "Quando tudo parecer estar indo contra você, lembre-se que o avião decola contra o vento, não com ele",
    "A verdadeira medida de um homem não é como ele se comporta em momentos de conforto e conveniência, mas em como ele se mantém em tempos de controvérsia e desafio",
    "Aquele que não tem confiança nos outros não lhes pode ganhar a confiança",
    "Nada é particularmente difícil se você dividi-lo em pequenas partes",
    "Você não é derrotado quando perde. Você é derrotado quando desiste",
    "Aquele que olha para fora sonha; quem olha para dentro, acorda",
    "A mente é tudo. Você se torna o que você pensa",
    "Quanto maior o obstáculo, mais glória em superá-lo",
    "Nós somos o que fazemos repetidamente. A excelência, portanto, não é um ato, mas um hábito",
    "Você não pode atravessar o mar simplesmente parando e olhando para a água",
    "As pessoas geralmente consideram impossível até que alguém faça",
    "A maior glória em viver está em levantar-se a cada vez que caímos",
    "A força não vem da capacidade física. Ela vem de uma vontade indomável",
    "Não é o que acontece com você, mas como você reage ao que acontece que importa",
    "O que você obtém ao alcançar seus objetivos não é tão importante quanto o que você se torna ao alcançá-los",
    "Pode ser que você esteja com medo de falhar, mas nunca saberá o quão grande você pode ser até que se desafie",
    "Você é o único obstáculo para seu próprio sucesso",
    "A verdadeira liberdade é viver como se você estivesse constantemente sendo observado por alguém que você respeita",
    "Não é sobre quanto tempo você dedica, mas quanto você dedica durante o tempo que você tem",
    "Quando você sente que quer desistir, lembre-se por que você começou",
    "Não deixe que o que você não pode fazer interfira no que você pode fazer",
    "A vida é um desafio, aceite-o",
    "dança gatinho dança",
    "Se você acredita, pode realizar",
    "Cada dia é uma oportunidade de ser melhor do que era ontem",
    "O que quer que a mente do homem possa conceber e acreditar, ela pode alcançar",
    "Quando você pensa que pode, você está meio lá",
    "Grandes coisas nunca vêm de zonas de conforto",
    "Você nunca é velho demais para definir outra meta ou sonhar um novo sonho"
  ];
  
  quotes.forEach(quote => {
    stmt.run(quote);
  });

  stmt.finalize();
});

module.exports = db;