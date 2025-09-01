const express = require('express');
const router = express.Router();
const controller = require('../controllers/storeController');

router.get('/', controller.validateList, controller.listStores);

module.exports = router;
