const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../database.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar com o banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        inicializarBanco();
    }
});

function inicializarBanco() {
    db.serialize(() => {
        // Criar tabelas
        db.run(`
            CREATE TABLE IF NOT EXISTS Filmes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                genero TEXT,
                duracao TEXT,
                classificacao TEXT,
                horario TEXT,
                sinopse TEXT,
                preco REAL,
                imagem TEXT
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS Clientes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cpf TEXT UNIQUE NOT NULL,
                email TEXT NOT NULL
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS Compras (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                cliente_id INTEGER,
                filme_id INTEGER,
                assento TEXT,
                tipo TEXT,
                valor REAL,
                data TEXT,
                status TEXT,
                FOREIGN KEY (cliente_id) REFERENCES Clientes (id),
                FOREIGN KEY (filme_id) REFERENCES Filmes (id)
            )
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS Assentos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filme_id INTEGER,
                codigo TEXT,
                ocupado INTEGER DEFAULT 0,
                FOREIGN KEY (filme_id) REFERENCES Filmes (id)
            )
        `, (err) => {
            if (!err) {
                // Preencher com dados iniciais se estiver vazio
                preencherDadosIniciais();
            }
        });
    });
}

function preencherDadosIniciais() {
    db.get("SELECT COUNT(*) AS count FROM Filmes", (err, row) => {
        if (row && row.count === 0) {
            console.log('Inserindo filmes e assentos iniciais...');
            const filmesIniciais = [
                {
                    titulo: 'Jurassic World: Rebirth',
                    genero: 'Ação, Ficção Científica',
                    duracao: '2h 10m',
                    classificacao: '12 Anos',
                    horario: '17:00',
                    sinopse: 'Cinco anos após os eventos do último filme, uma equipe de especialistas tenta resgatar DNA de dinossauros na selva.',
                    preco: 32.00,
                    imagem: 'https://media.themoviedb.org/t/p/w500/kAVRgw7GgK1CfYEJq8ME6EvRIgU.jpg'
                },
                {
                    titulo: 'Lilo & Stitch',
                    genero: 'Animação, Família',
                    duracao: '1h 45m',
                    classificacao: 'Livre',
                    horario: '10:00',
                    sinopse: 'O clássico filme agora em uma versão encantadora, acompanhe Lilo e sua criaturinha alienígena Stitch.',
                    preco: 25.00,
                    imagem: 'https://media.themoviedb.org/t/p/w500/m58Oxr3OZZbP2kTX2tj8TiAMLSv.jpg'
                },
                {
                    titulo: 'Como Treinar o Seu Dragão',
                    genero: 'Ação, Aventura',
                    duracao: '1h 50m',
                    classificacao: 'Livre',
                    horario: '13:00',
                    sinopse: 'O live-action baseado na incrível amizade entre Soluço e Banguela.',
                    preco: 28.00,
                    imagem: 'https://media.themoviedb.org/t/p/w500/xvx4Yhf0DVH8G4LzNISpMfFBDy2.jpg'
                },
                {
                    titulo: 'Quarteto Fantástico',
                    genero: 'Ação, Sci-Fi',
                    duracao: '2h 20m',
                    classificacao: '12 Anos',
                    horario: '20:30',
                    sinopse: 'A primeira família da Marvel se une para proteger a humanidade de uma nova ameaça.',
                    preco: 35.00,
                    imagem: 'https://media.themoviedb.org/t/p/w500/4AGuX3IMPzs3sc3dJrnpLZzGvUa.jpg'
                }
            ];

            const stmtFilme = db.prepare(`INSERT INTO Filmes (titulo, genero, duracao, classificacao, horario, sinopse, preco, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
            
            filmesIniciais.forEach((filme, index) => {
                stmtFilme.run([filme.titulo, filme.genero, filme.duracao, filme.classificacao, filme.horario, filme.sinopse, filme.preco, filme.imagem], function(err) {
                    if (!err) {
                        const filme_id = this.lastID;
                        // Gerar assentos A1-E5
                        const fileiras = ['A', 'B', 'C', 'D', 'E'];
                        const stmtAssento = db.prepare(`INSERT INTO Assentos (filme_id, codigo, ocupado) VALUES (?, ?, 0)`);
                        
                        fileiras.forEach(fileira => {
                            for (let i = 1; i <= 5; i++) {
                                stmtAssento.run([filme_id, `${fileira}${i}`]);
                            }
                        });
                        stmtAssento.finalize();
                    }
                });
            });
            stmtFilme.finalize();
        }
    });
}

module.exports = db;
