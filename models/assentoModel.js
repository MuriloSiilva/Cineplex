const db = require('../database/database');

const AssentoModel = {
    getByFilmeId: (filmeId) => {
        const idInt = parseInt(filmeId, 10);
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Assentos WHERE filme_id = ?`, [idInt], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    verificarDisponibilidade: (filmeId, codigo) => {
        const idInt = parseInt(filmeId, 10);
        return new Promise((resolve, reject) => {
            db.get(`SELECT ocupado FROM Assentos WHERE filme_id = ? AND codigo = ?`, [idInt, codigo], (err, row) => {
                if (err) {
                    reject(err);
                } else if (!row) {
                    resolve(false); // Assento não existe
                } else if (row.ocupado === 1) {
                    resolve(false); // Ocupado
                } else {
                    resolve(true); // Disponível
                }
            });
        });
    },

    ocuparAssento: (filmeId, codigo) => {
        const idInt = parseInt(filmeId, 10);
        return new Promise((resolve, reject) => {
            db.run(`UPDATE Assentos SET ocupado = 1 WHERE filme_id = ? AND codigo = ?`, [idInt, codigo], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
};

module.exports = AssentoModel;
