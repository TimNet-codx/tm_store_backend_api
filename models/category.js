// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  image: {
    type: String,
    required: true,
  },

  banner: {
    type: String,
    required: true,
  }
},
{ timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

// module.exports = Category;
export default Category;