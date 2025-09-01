const { Schema, model, Types } = require('mongoose');

const productSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    images: [{ type: String, default: [] }],
    type: {
      type: String,
      enum: ['ring', 'necklace', 'earring', 'bracelet', 'bangle'],
      required: true,
      index: true,
    },
    material: {
      type: String,
      enum: ['gold', 'diamond', 'platinum', 'rose-gold', 'gemstone', 'white-gold'],
      required: true,
      index: true,
    },
    occasion: {
      type: String,
      enum: ['bridal', 'festive', 'daily-wear', 'gift', 'office'],
      required: true,
      index: true,
    },
    collection: { type: Types.ObjectId, ref: 'Collection' },
    sku: { type: String },
    sizes: [{ type: String }],
    featured: { type: Boolean, default: false },
    mostLoved: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model('Product', productSchema);
