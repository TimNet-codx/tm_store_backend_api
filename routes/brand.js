// const express = require('express');
import express from "express";
import Brand  from "../models/brand.js";
import Product from "../models/product.js";

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


// brandsRouter.get("/api/get-brandwithProduct-data", async(req, res) => {
//   try {
//     // Start both queries at the same time for better performance
//     const [brandsData, productsData] = await Promise.all([
//       Brand.find({}).select('brandName image'), // Only get specific fields
//       Product.find({}).select('productName quantity') // Only get specific fields
//     ]);

//     // Merge them into one response object
//     res.status(200).json({
//       success: true,
//       brands: brandsData,
//       products: productsData
//     });
//   } catch (error) {
//     console.error("Error fetching merged data:", error);
//     res.status(500).json({ msg: "Server Error" });
//   }
// });



// Backend Update for Grouping
brandsRouter.get("/api/get-brandwithProduct-data", async(req, res) => {
  try {
    const brands = await Brand.find({}).select('brandName image category');
    const products = await Product.find({}).select('productName quantity category');

    // Grouping logic: Get unique categories
    const categoryNames = [...new Set([...brands.map(b => b.category), ...products.map(p => p.category)])];

    const mergedCategories = categoryNames.map(cat => ({
      name: cat,
      brands: brands.filter(b => b.category === cat),
      products: products.filter(p => p.category === cat),
      totalProducts: products.filter(p => p.category === cat).length
    }));

    res.status(200).json(mergedCategories); // This returns a LIST of Categories
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});


brandsRouter.get('/api/merged-category-data', async (req, res) => {
  try {
    const mergedData = await Product.aggregate([
      {
        // 1. Join with the Brands collection based on the category string
        $lookup: {
          from: "brands",           // Name of the brands collection in MongoDB
          localField: "category",   // Field in Product
          foreignField: "category", // Field in Brands
          as: "matchedBrands"
        }
      },
      {
        // 2. Group by the category name
        $group: {
          _id: "$category", 
          totalProducts: { $sum: 1 }, // Count how many products are in this category
          products: { 
            $push: { 
              productName: "$productName", 
              quantity: "$quantity" 
            } 
          },
          // Since we lookup brands for every product, we use $first or $addToSet
          // to get the unique brands associated with this category string
          brands: { $first: "$matchedBrands" } 
        }
      },
      {
        // 3. Clean up the output
        $project: {
          category: "$_id",
          _id: 0,
          totalProducts: 1,
          products: 1,
          "brands.brandName": 1,
          "brands.image": 1
        }
      }
    ]);

    res.status(200).json(mergedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server Error" });
  }
});


brandsRouter.get('/api/category-summary', async (req, res) => {
  try {
    const summary = await Product.aggregate([
      {
        // 1. Join with Brands collection where the 'category' field matches
        $lookup: {
          from: "brands",           // Name of the brands collection in your DB
          localField: "category",   // Field name in Product model
          foreignField: "category", // Field name in Brands model
          as: "matchedBrands"
        }
      },
      {
        // 2. Group by category name to merge all products of the same category
        $group: {
          _id: "$category",
          productCount: { $sum: 1 }, // Counts how many products are in this category
          products: { 
            $push: { 
              name: "$productName", 
              qty: "$quantity" 
            } 
          },
          // Get the brands associated with this category
          // We use $first because all products in this category share the same brand list
          allBrands: { $first: "$matchedBrands" }
        }
      },
      {
        // 3. Final cleanup: Rename fields and remove duplicates
        $project: {
          _id: 0,
          categoryName: "$_id",
          productCount: 1,
          products: 1,
          // We only want brandName and image from the brands array
          brands: {
            $map: {
              input: "$allBrands",
              as: "b",
              in: { name: "$$b.brandName", img: "$$b.image" }
            }
          }
        }
      }
    ]);

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// module.exports = brandsRouter;  
export default brandsRouter;