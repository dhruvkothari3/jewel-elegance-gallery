const { validationResult, query, param } = require('express-validator');
const Product = require('../models/Product');
const Collection = require('../models/Collection');

exports.validateList = [
  query('type').optional().isIn(['ring', 'necklace', 'earring', 'bracelet', 'bangle']),
  query('material').optional().isIn(['gold', 'diamond', 'platinum', 'rose-gold', 'gemstone', 'white-gold']),
  query('occasion').optional().isIn(['bridal', 'festive', 'daily-wear', 'gift', 'office']),
  query('collection').optional().isString().trim().notEmpty(), // collection handle
];

exports.listProducts = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { type, material, occasion, collection } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (material) filter.material = material;
    if (occasion) filter.occasion = occasion;

    if (collection) {
      const col = await Collection.findOne({ handle: collection });
      if (!col) return res.status(404).json({ error: 'Collection not found' });
      filter.collection = col._id;
    }

    const products = await Product.find(filter)
      .populate('collection', 'handle title')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.validateGetBySlug = [param('slug').isString().trim().notEmpty()];

exports.getProductBySlug = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { slug } = req.params;
    const product = await Product.findOne({ slug }).populate('collection', 'handle title');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};
