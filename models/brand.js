const mongoose = require('mongoose');

const brandsSchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
  },
  categoryName: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  brandName: {
    type: String,
    required: true,

  }   
},
{ timestamps: true }
);

const brands = mongoose.model("Brands", brandsSchema);

module.exports = brands;