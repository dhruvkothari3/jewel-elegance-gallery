const { Schema, model } = require('mongoose');

const storeSchema = new Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    hours: { type: String, default: '' },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true }
);

module.exports = model('Store', storeSchema);
