// const express = require('express');
import express from 'express';
// const Banner = require('../models/banner');
// import Banner from '../models/banner';
import Banner from '../models/banner.js';

const bannerRouter = express.Router();

// Create a new Banner
bannerRouter.post('/api/banner', async(req, res) => {
  try {
     const {image, title, description} = req.body;
     const banner = new Banner({image, title, description}); 
     await banner.save();
     return res.status(201).send(banner);
  } catch (e) {
     res.status(400).json({error: e.message}); 
  }
});

// Get all Banners
bannerRouter.get('/api/banners', async(req, res) => {
    try {
        const banners = await Banner.find();
        res.status(200).json(banners);
    } catch (error) {
       res.status(400).json({error: e.message});     
    }
})

// module.exports = bannerRouter;
export default bannerRouter;