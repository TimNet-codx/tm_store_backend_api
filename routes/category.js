const express = require('express');
const Category = require('../models/category');

const categoryRouter = express.Router();

// Create a new category

categoryRouter.post("/api/category", async(req, res) => {
    try {
        const {
            name, 
            image, 
            banner
        } = req.body;
        const  category = new Category({
            name, 
            image, 
            banner
        });
        await category.save();
        res.status(201).send(category);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// Get All Categories
categoryRouter.get("/api/categories", async(req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({categories});
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// Get Categories By Name
categoryRouter.get("/api/categories/:name", async(req, res) => {
    try{
        const {name} = req.params;
        const category = await Category.findOne({name});
        res.status(200).json({category});
    }catch(e){
        res.status(500).json({error: e.message});
    }
});


module.exports = categoryRouter;