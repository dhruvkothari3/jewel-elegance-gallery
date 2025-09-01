const { validationResult, param } = require('express-validator');
const Collection = require('../models/Collection');
const Product = require('../models/Product');

exports.listCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find({}).sort({ title: 1 });
    res.json(collections);
  } catch (err) {
    next(err);
  }
};

exports.validateGetByHandle = [param('handle').isString().trim().notEmpty()];

exports.getCollectionByHandle = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { handle } = req.params;
    const collection = await Collection.findOne({ handle });
    if (!collection) return res.status(404).json({ error: 'Collection not found' });

    const products = await Product.find({ collection: collection._id })
      .populate('collection', 'handle title')
      .sort({ createdAt: -1 });

    res.json({ collection, products });
  } catch (err) {
    next(err);
  }
};
