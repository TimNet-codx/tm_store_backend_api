import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
   fullName:{
    type: String,
    required: true,
   },

   email: {
     type: String,
     required: true,
   },

   state: {
        type: String,
       required: true,
    },

  city: {
        type: String,
        required: true,
    },

  street: {
        type: String,
        required: true,
    },

   productName: {
    type: String,
    required: true,
   },
    productPrice: {
    type: Number,
    required: true,
   },
   quantity: {
    type: Number,
    required: true,
   },
   category:{
    type: String,
    required: true,
   },
   image:{
    type: String,
    required: true,
   },
   buyerdId:{
    type: String,
    required: true,
   },
   vendorId: {
    type: String,
    required: true,
   },
   processing:{
    type: Boolean,
    default: true,
   },
   delivered: {
    type: Boolean,
    default: false,
   },
},
{ timestamps: true });

const Order = mongoose.model("Order", orderSchema);

// module.exports = Order;

export default Order