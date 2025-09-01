require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const Store = require('../models/Store');
const { collections, products, stores } = require('./data');

async function run() {
  try {
    await connectDB();

    // Clear existing
    await Promise.all([
      Product.deleteMany({}),
      Collection.deleteMany({}),
      Store.deleteMany({}),
    ]);

    // Create collections
    const createdCollections = await Collection.insertMany(collections);
    const collectionMap = createdCollections.reduce((acc, c) => {
      acc[c.handle] = c._id;
      return acc;
    }, {});

    // Map products to collection ObjectIds
    const productsToInsert = products.map((p) => ({
      ...p,
      collection: collectionMap[p.collection],
    }));

    await Product.insertMany(productsToInsert);
    await Store.insertMany(stores);

    console.log('Seed complete.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
