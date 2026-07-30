const FilmeModel = require('../models/filmeModel');

exports.listarFilmes = async (req, res) => {
    try {
        const filmes = await FilmeModel.getAll();
        res.json(filmes);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar filmes.' });
    }
};

exports.detalhesFilme = async (req, res) => {
    const id = req.params.id;
    try {
        const filme = await FilmeModel.getById(id);
        if (filme) {
            res.json(filme);
        } else {
            res.status(404).json({ erro: 'Filme não encontrado.' });
        }
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar detalhes do filme.' });
    }
};
