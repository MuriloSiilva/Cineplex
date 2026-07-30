const express = require('express');
const router = express.Router();
const AssentoModel = require('../models/assentoModel');

router.get('/:filme_id', async (req, res) => {
    try {
        const assentos = await AssentoModel.getByFilmeId(req.params.filme_id);
        res.json(assentos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar assentos.' });
    }
});

module.exports = router;
