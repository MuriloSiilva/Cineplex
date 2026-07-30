const express = require('express');
const router = express.Router();
const filmesController = require('../controllers/filmesController');

router.get('/', filmesController.listarFilmes);
router.get('/:id', filmesController.detalhesFilme);

module.exports = router;
