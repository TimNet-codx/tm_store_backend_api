const express = require('express');
const SubCategory = require('../models/sub_category');

const subCategoryRouter = express.Router();

// Create a new SubCategory
subCategoryRouter.post("/api/subcategory", async(req, res) => {
    try {
        const {categoryId, categoryName, image, subCategoryName} = req.body;
        const subCategory = new SubCategory({categoryId, categoryName, image, subCategoryName});
        await subCategory.save();
        res.status(201).send(subCategory);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// Get SubCategory by Category ID Or Category Name
subCategoryRouter.get("/api/category/:categoryName/subcategories", async(req, res) => {
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


// Get All  Sub Categories
subCategoryRouter.get("/api/subcategories", async(req, res) => {
    try {
        const subCategories = await SubCategory.find();
        res.status(200).json({subCategories});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});


module.exports = subCategoryRouter;