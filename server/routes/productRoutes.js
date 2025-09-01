const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

router.get('/', controller.validateList, controller.listProducts);
router.get('/:slug', controller.validateGetBySlug, controller.getProductBySlug);

module.exports = router;
