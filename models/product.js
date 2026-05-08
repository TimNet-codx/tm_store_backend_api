const mongoose = require('mongoose');
const subCategory = require('./sub_category');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        trim: true,
        required: true
    },
    productPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock:{
        type: Number,
       // required: true
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true
    },
    vendorId:{
        type: String,
        required: true
    },
    fullName:{
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            required: true,
        }
    ],
    popular: {
        type: Boolean,
        default: true
    },
    favourite: {
        type: Boolean,
        default: false
    },
    recommend: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;