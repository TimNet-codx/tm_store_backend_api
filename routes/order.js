import express from "express";
import Order from "../models/order.js";
const orderRouter = express.Router();

// Create a new order
orderRouter.post("/api/ ", async(req, res) => {
    try{
        const {fullName,email, state, city, street, productName,productPrice, quantity, category, image, buyerdId, vendorId} = req.body;
        const createdAt = new Date().getMilliseconds(); // Get the current timestamp in milliseconds
        const order = new Order({fullName, email, state, city, street, productName,productPrice, quantity, category, image, buyerdId, vendorId, createdAt});
        await order.save();
       return res.status(201).json({order});
    } catch(error){
        res.status(500).json({error: error.message});
    }
});


export default orderRouter;
    