const db = require('../database/database');

const FilmeModel = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            db.all(`SELECT * FROM Filmes`, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    getById: (id) => {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM Filmes WHERE id = ?`, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
};

module.exports = FilmeModel;
