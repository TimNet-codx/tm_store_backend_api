// const mongoose = require('mongoose');
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  // Reference your existing Product model directly
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  // Keep track of how many items the user wants to buy
  quantity: { 
    type: Number, 
    required: true,
    
  }
});

const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User',
  },
  items: [cartItemSchema]
}, 
{ timestamps: true }
);

// module.exports = mongoose.model('Cart', cartSchema);
export default mongoose.model('Cart', cartSchema);
