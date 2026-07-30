const express = require('express');
const router = express.Router();
const comprasController = require('../controllers/comprasController');

router.post('/', comprasController.realizarCompra);
router.get('/:id', comprasController.getComprovante);

module.exports = router;
