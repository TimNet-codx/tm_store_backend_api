const express = require('express');
const Product = require('../models/product');

const productRouter = express.Router();

// Create a new product
productRouter.post('/api/add-product', async(req, res) => {
    try {
        const {productName, productPrice, quantity, description, category, subCategory, images, vendorId, fullName} = req.body;
        const product = new Product({productName, productPrice, quantity, description, category, subCategory, images, vendorId, fullName});
        await product.save();
       return res.status(201).send(product);
    } catch (e) {
     res.status(400).json({error: e.message}); 
        
    }
});

// Get Popula Products
productRouter.get('/api/get-popular-products', async(req, res) => {
    try {
        const popularProducts = await Product.find({popular: true});

        if(!popularProducts || popularProducts.length == 0){
            return res.status(404).json({msg: "No popular products found"});
        } else{
           return res.status(200).json({popularProducts});
        }
    } catch (e) {
     res.status(400).json({error: e.message}); 
        
    }
});

// Get Recommended Products
productRouter.get('/api/get-recommended-products', async(req, res) => {
    try {
        const recommendedProducts = await Product.find({recommend: true});

        if(!recommendedProducts || recommendedProducts.length == 0){
            return res.status(404).json({msg: "No Recommended Products found"});
        } else{
           return res.status(200).json({recommendedProducts});
        }
    } catch (e) {
     res.status(400).json({error: e.message}); 
        
    }
});

module.exports = productRouter;
