const { Schema, model } = require('mongoose');

const collectionSchema = new Schema(
  {
    handle: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    intro: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = model('Collection', collectionSchema);
