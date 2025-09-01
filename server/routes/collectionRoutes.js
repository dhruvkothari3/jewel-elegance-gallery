const express = require('express');
const router = express.Router();
const controller = require('../controllers/collectionController');

router.get('/', controller.listCollections);
router.get('/:handle', controller.validateGetByHandle, controller.getCollectionByHandle);

module.exports = router;
