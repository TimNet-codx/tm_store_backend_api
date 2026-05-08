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

// Get Favourite Products
productRouter.get('/api/get-favourite-products', async(req, res) => {
    try {
        const favouriteProducts = await Product.find({favourite: true});

        if(!favouriteProducts || favouriteProducts.length == 0){
            return res.status(404).json({msg: "No favourite products found"});
        } else{
           return res.status(200).json({favouriteProducts});
        }
    } catch (e) {
     res.status(400).json({error: e.message}); 
        
    }
});


productRouter.post('/api/toggle-favourite', async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ msg: "Product ID is required" });
        }

        // 1. First, get the current product to see what the current favourite status is
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        // 2. Use findByIdAndUpdate to bypass "required" validation on other fields
        // { $set: { favourite: !product.favourite } } toggles the value
        // { new: true } returns the updated document
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: { favourite: !product.favourite } },
            { new: true, runValidators: false } // 'runValidators: false' ignores the fullName/vendorId requirements
        );

        console.log("Updated Product:", updatedProduct.productName, "Favourite:", updatedProduct.favourite);

        return res.status(200).json({msg: updatedProduct.favourite ? "Added to favourites" : "Removed from favourites", 
            favourite: updatedProduct.favourite,productId: updatedProduct._id 
        });

    } catch (e) {
        console.error("Toggle Error:", e.message);
        res.status(500).json({ error: e.message });
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

// Get All Products
productRouter.get('/api/get-all-products', async(req, res) => {
    try {
        const allProducts = await Product.find();

        if(!allProducts || allProducts.length == 0){
            return res.status(404).json({msg: "No products found"});
        } else{
           return res.status(200).json({allProducts});
        }
    } catch (e) {
     res.status(400).json({error: e.message}); 
        
    }
});

//Get Product By Id, Category, and Details
productRouter.get("/api/get-productByIdAndCategory", async(req, res) =>  {
    try{
        const {productId, category} = req.query;

        if(!productId || !category){
            return res.status(400).json({msg: "Product ID and Category are required"});
        }

        const product = await Product.findOne({_id: productId, category: category});

        if(!product){
            return res.status(404).json({msg: "Product not found"});
        } else{
            return res.status(200).json({product});
        }

    }catch(e){
        res.status(400).json({error: e.message}); 
    }
}) 

productRouter.get("/api/products/details", async (req, res) => {
  try {
    const { productId, category } = req.query;

    if (!productId || !category) {
      return res.status(400).json({
        msg: "Product ID and category are required",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      category,
    })
      .populate("category", "name slug")
      .populate("seller", "name email phone");

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//Get Product By Id and  Category



module.exports = productRouter;
