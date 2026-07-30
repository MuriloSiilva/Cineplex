const db = require('../database/database');

const CompraModel = {
    registrarCliente: (nome, cpf, email) => {
        return new Promise((resolve, reject) => {
            // Verifica se cliente já existe pelo CPF
            db.get(`SELECT id FROM Clientes WHERE cpf = ?`, [cpf], (err, row) => {
                if (err) return reject(err);
                
                if (row) {
                    // Atualiza o nome/email se necessário ou apenas retorna o ID
                    resolve(row.id);
                } else {
                    db.run(`INSERT INTO Clientes (nome, cpf, email) VALUES (?, ?, ?)`, [nome, cpf, email], function(err) {
                        if (err) return reject(err);
                        resolve(this.lastID);
                    });
                }
            });
        });
    },

    registrarCompra: (clienteId, filmeId, assento, tipo, valor, data, status) => {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO Compras (cliente_id, filme_id, assento, tipo, valor, data, status) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                [clienteId, filmeId, assento, tipo, valor, data, status], 
                function(err) {
                    if (err) return reject(err);
                    resolve(this.lastID);
                }
            );
        });
    },

    getComprovante: (compraId) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    Compras.id AS compra_id,
                    Compras.assento,
                    Compras.tipo,
                    Compras.valor,
                    Compras.data,
                    Clientes.nome AS cliente_nome,
                    Clientes.email AS cliente_email,
                    Filmes.titulo AS filme_titulo,
                    Filmes.horario AS filme_horario,
                    Filmes.imagem AS filme_imagem
                FROM Compras
                JOIN Clientes ON Compras.cliente_id = Clientes.id
                JOIN Filmes ON Compras.filme_id = Filmes.id
                WHERE Compras.id = ?
            `;
            db.get(query, [compraId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
};

module.exports = CompraModel;
