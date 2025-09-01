const { validationResult, query } = require('express-validator');
const Store = require('../models/Store');

exports.validateList = [query('city').optional().isString().trim().notEmpty()];

exports.listStores = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { city } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(`^${city}$`, 'i');

    const stores = await Store.find(filter).sort({ city: 1, name: 1 });
    res.json(stores);
  } catch (err) {
    next(err);
  }
};
