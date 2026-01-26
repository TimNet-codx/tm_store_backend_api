const express = require('express');
const Brand = require('../models/brand');

const brandsRouter = express.Router();

// Create a new Brand
brandsRouter.post("/api/brand", async(req, res) => {
    try {
        const {categoryId, categoryName, image, brandName} = req.body;
        const brand = new Brand({categoryId, categoryName, image, brandName});
        await brand.save();
        res.status(201).send(brand);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// Get SubCategory by Category ID Or Category Name
brandsRouter.get("/api/category/:categoryName/subcategory", async(req, res) => {
    try {
           // Extract the category name from the request parameter
    const {categoryName} = req.params;
    const subCategories = await SubCategory.find({categoryName: categoryName});

    // Check is any subCategory exist or where found
    if(!subCategories || subCategories.length == 0){
        // If no subCategory are found, respons with a 404 status and a message
        return res.status(404).json({msg: "No SubCategories Found"});
    } else{
        return res.status(200).json(subCategories);
    }    
    } catch (e) {
        res.status(500).json({error: e.message});
        
    }
});


// Get All  Brands
brandsRouter.get("/api/brands", async(req, res) => {
    try {
        const brands = await Brand.find();
        res.status(200).json({brands});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


module.exports = brandsRouter;  