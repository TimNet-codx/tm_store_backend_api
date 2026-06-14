// const express = require('express');
import express from "express";
import Cart from "../models/cart.js";

const cartRouter = express.Router();
// const mongoose = require('mongoose');
import mongoose from 'mongoose';

// 1. POST: Sync Cart Data from App to Database
// cartRouter.post('/api/cart/sync', async (req, res) => {
//   try {
//     const { items } = req.body;
//     const userId = req.body.userId || req.user?.id;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // Format the items from frontend to match our mongoose schema structure
//     const formattedItems = items.map(item => ({
//       product: item.productId, // Flutter passing 'productId' maps to 'product' ObjectId
//       quantity: item.quantity  // The bought count
//     }));

//     // Find and update the cart, or create a brand new one if none exists
//     let cart = await Cart.findOneAndUpdate(
//       { userId: userId },
//       { items: formattedItems },
//       { new: true, upsert: true }
//     );

//     res.status(200).json({ success: true, message: "Cart synced safely!", cart });
//   } catch (error) {
//     console.error("Sync Error: ", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// cartRouter.post('/api/cart/sync', async (req, res) => {
//   try {
//     const { items } = req.body;
//     const userId = req.body.userId || req.user?.id;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // 1. ✅ CONVERSION: Convert the incoming string into a strict MongoDB ObjectId
//     let parsedUserId;
//     try {
//       parsedUserId = new mongoose.Types.ObjectId(userId);
//     } catch (castError) {
//       return res.status(400).json({ message: "Invalid User ID format string structure" });
//     }

//     if (!items || !Array.isArray(items)) {
//       return res.status(400).json({ message: "Items array is required" });
//     }

//     // Format the items from frontend to match our mongoose schema structure
//     const formattedItems = items.map(item => ({
//       product: item.productId, // Flutter passing 'productId' maps to 'product' ObjectId
//       quantity: item.quantity  // The bought count
//     }));

//     // 2. ✅ FIND & UPDATE: Query using the typed parsedUserId object 
//     let cart = await Cart.findOneAndUpdate(
//       { userId: parsedUserId }, // Matches your updated schema design perfectly now!
//       { items: formattedItems },
//       { new: true, upsert: true }
//     );

//     res.status(200).json({ success: true, message: "Cart synced safely!", cart });
//   } catch (error) {
//     console.error("Sync Error: ", error);
//     res.status(500).json({ error: error.message });
//   }
// });

cartRouter.post('/api/cart/sync', async (req, res) => {
  try {
    const { items, userId } = req.body;

    console.log("------------------- CART SYNC START -------------------");
    console.log("📥 Incoming User ID Str:", userId);

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    let parsedUserId;
    try {
      parsedUserId = new mongoose.Types.ObjectId(userId);
    } catch (err) {
      console.log("❌ CRITICAL: User ID hex casting failed!");
      return res.status(400).json({ success: false, message: "Invalid User ID format" });
    }

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Items must be an array" });
    }

    const formattedItems = [];
    for (const item of items) {
      const finalProductId = item.productId || item.id;

      if (!finalProductId) {
        console.log("⚠️ Skipped item due to missing ID key field configuration.");
        continue;
      }

      try {
        formattedItems.push({
          product: new mongoose.Types.ObjectId(finalProductId),
          quantity: parseInt(item.quantity, 10) || 1
        });
      } catch (castErr) {
        console.log(`❌ Failed casting Product ID string "${finalProductId}"`);
      }
    }

    console.log("⚙️ Verified Payload array committing to Mongo:", JSON.stringify(formattedItems, null, 2));

    // 🔴 THE CORE DIAGNOSTIC UPDATE: Capture validation rejections explicitly
    let cart;
    try {
      cart = await Cart.findOneAndUpdate(
        { userId: parsedUserId },
        { items: formattedItems },
        { new: true, upsert: true, runValidators: true } 
      );
      console.log("💾 SUCCESS! Current state of document in MongoDB:", JSON.stringify(cart, null, 2));
    } catch (dbError) {
      console.error("❌ MONGODB WRITE ERROR CAUGHT:");
      console.error(dbError); // This will print the exact validation error to your console!
      return res.status(422).json({ 
        success: false, 
        message: "Database rejected payload structural formatting rules", 
        details: dbError.message 
      });
    }

    console.log("-------------------- CART SYNC END --------------------");
    return res.status(200).json({ success: true, message: "Cart synced safely!", cart });

  } catch (error) {
    console.error("💥 General System Crash Error: ", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. GET: Fetch Stored Cart (With populated Product details)
  // cartRouter.get('/api/cart', async (req, res) => {
  //   try {
  //     const userId = req.query.userId || req.user?.id;

  //     if (!userId) {
  //       return res.status(400).json({ message: "User ID is required" });
  //     }

  //     // Grab the cart and pull entire documents out of the Product collection automatically!
  //     const cart = await Cart.findOne({ userId: userId }).populate('items.product');

  //     if (!cart || cart.items.length === 0) {
  //       return res.status(200).json([]); // Return empty array if cart is empty
  //     }

  //     // Transform data back to look exactly like your Flutter CartModel expects
  //     const responseData = cart.items.map(item => {
  //       // If a product was deleted from the admin panel, skip it safely
  //       if (!item.product) return null; 

  //       return {
  //         productId: item.product._id,
  //         productName: item.product.productName,
  //         productPrice: item.product.productPrice,
  //         category: item.product.category,
  //         images: item.product.images,
  //         vendorId: item.product.vendorId,
  //         productQuantity: item.product.quantity || item.product.stock || 0, // Stock check
  //         quantity: item.quantity, // Bought count
  //         description: item.product.description,
  //         fullName: item.product.fullName,
  //       };
  //     }).filter(Boolean); // Cleans out any null values safely

  //     res.status(200).json(responseData);
  //   } catch (error) {
  //     console.error("Fetch Error: ", error);
  //     res.status(500).json({ error: error.message });
  //   }
  // });

//   cartRouter.get('/api/cart', async (req, res) => {
//   try {
//     const rawUserId = req.query.userId || req.params.userId || req.body?.userId || req.user?.id;

//     if (!rawUserId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     // ✅ FIX: Manually cast the string variable into a strict MongoDB ObjectId wrapper
//     let parsedUserId;
//     try {
//       parsedUserId = new mongoose.Types.ObjectId(rawUserId);
//     } catch (castError) {
//       return res.status(400).json({ message: "Invalid User ID format string" });
//     }

//     // Now look up your cart using the casted object type
//     const cart = await Cart.findOne({ userId: parsedUserId }).populate({
//       path: 'items.product',
//       model: 'Product' 
//     });

//     if (!cart || !cart.items || cart.items.length === 0) {
//       return res.status(200).json([]); 
//     }

//     const responseData = cart.items.map(item => {
//       if (!item.product) return null; 

//       return {
//         productId: item.product._id,
//         productName: item.product.productName,
//         productPrice: item.product.productPrice,
//         category: item.product.category,
//         images: item.product.images,
//         vendorId: item.product.vendorId,
//         productQuantity: item.product.quantity !== undefined ? item.product.quantity : (item.product.stock || 0), 
//         quantity: item.quantity, 
//         description: item.product.description,
//         fullName: item.product.fullName,
//       };
//     }).filter(Boolean);

//     res.status(200).json(responseData);
//   } catch (error) {
//     console.error("Fetch Error: ", error);
//     res.status(500).json({ error: error.message });
//   }
// });

cartRouter.get('/api/cart', async (req, res) => {
  try {
    const rawUserId = req.query.userId || req.params.userId || req.body?.userId || req.user?.id;

    if (!rawUserId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    let parsedUserId;
    try {
      parsedUserId = new mongoose.Types.ObjectId(rawUserId);
    } catch (castError) {
      return res.status(400).json({ success: false, message: "Invalid User ID format string" });
    }

    // Explicitly populate items using your schema guidelines
    const cart = await Cart.findOne({ userId: parsedUserId }).populate({
      path: 'items.product',
      model: 'Product' 
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(200).json([]); 
    }

    const responseData = cart.items.map(item => {
      if (!item.product) return null; 

      return {
        productId: item.product._id.toString(),
        productName: item.product.productName || "",
        productPrice: item.product.productPrice || 0,
        category: item.product.category || "",
        images: item.product.images || [],
        vendorId: item.product.vendorId || "",
        // Resolves mapping to avoid writing 0 product stock back down to your Flutter application views
        productQuantity: item.product.productQuantity !== undefined 
          ? item.product.productQuantity 
          : (item.product.quantity !== undefined ? item.product.quantity : 0), 
        quantity: item.quantity || 1, 
        description: item.product.description || "",
        fullName: item.product.fullName || "",
      };
    }).filter(Boolean);

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Fetch Error: ", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});


cartRouter.delete('/api/cart/clear', async (req, res) => {
  try{
    const rawUserId = req.query.userId || req.params.userId || req.body?.userId || req.user?.id;
    if (!rawUserId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }
    let parsedUserId;
    try {
      parsedUserId = new mongoose.Types.ObjectId(rawUserId);
    } catch (castError) {
      return res.status(400).json({ success: false, message: "Invalid User ID format string" });
    }
    await Cart.findOneAndUpdate(
      { userId: parsedUserId },
      { items: [] },
      { new: true }
    );
    res.status(200).json({ success: true, message: "Cart cleared successfully!" });


  }catch (error){
    console.error("Clear Cart Error: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// cartRouter.delete('/api/cart/remove-item', async (req, res) => {
//   try {
//     // 1. Gather identifiers from all possible incoming locations
//     const rawUserId = req.body?.userId || req.query?.userId || req.user?.id;
//     const rawProductId = req.body?.id || req.query?.id || req.body?.productId || req.query?.productId;

//     if (!rawUserId || !rawProductId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Both User ID and Product ID are required parameters." 
//       });
//     }

//     // 2. Validate and cast to Mongoose ObjectIds safely
//     let parsedUserId;
//     try {
//       parsedUserId = new mongoose.Types.ObjectId(rawUserId);
//     } catch (castError) {
//       return res.status(400).json({ success: false, message: "Invalid User ID format string" });
//     }

//     // 3. Use $pull to pluck the single item out of the items array based on its productId
//     const updatedCart = await Cart.findOneAndUpdate(
//       { userId: parsedUserId },
//       { 
//         $pull: { 
//           items: { product: rawProductId } // Matches the item inside the array
//         } 
//       },
//       { new: true } // Returns the modified document state
//     );

//     if (!updatedCart) {
//       return res.status(404).json({ success: false, message: "Cart not found for this user." });
//     }

//     res.status(200).json({ 
//       success: true, 
//       message: "Selected item removed from cart successfully!",
//       cart: updatedCart 
//     });

//   } catch (error) {
//     console.error("Remove Single Item Cart Error: ", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });



// cartRouter.delete('/api/cart/remove-item', async (req, res) => {
//   try {
//     // Read parameters directly out of the incoming req.body JSON block
//     const rawUserId = req.body?.userId || req.query?.userId || req.user?.id;
//     const rawProductId = req.body?.productId || req.query?.productId || req.body?.id || req.query?.id;

//     if (!rawUserId || !rawProductId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: "Both User ID and Product ID are required." 
//       });
//     }

//     let parsedUserId = new mongoose.Types.ObjectId(rawUserId);

//     // 1. Find the user's cart document first
//     const cart = await Cart.findOne({ userId: parsedUserId });
    
//     if (!cart) {
//       return res.status(404).json({ success: false, message: "Cart document not found." });
//     }

//     // 2. Locate where the target product lies within the items array map
//     const itemIndex = cart.items.findIndex(item => item.product.toString() === rawProductId.toString());

//     if (itemIndex === -1) {
//       return res.status(404).json({ success: false, message: "Selected item not found inside cart array." });
//     }

//     const currentItem = cart.items[itemIndex];
//     let updatedCart;
    
//     // 3. Conditional assessment routing for decrementing quantity vs flat deletion
//     if (currentItem.quantity > 1) {
//       // If quantity is greater than 1, decrement it by 1 using positional identifier string syntax
//       updatedCart = await Cart.findOneAndUpdate(
//         { userId: parsedUserId, "items.product": rawProductId },
//         { $inc: { "items.$.quantity": -1 } }, 
//         { new: true }
//       );
//     } else {
//       // If quantity is exactly 1, drop the entire matching object completely out of the collection array
//       updatedCart = await Cart.findOneAndUpdate(
//         { userId: parsedUserId },
//         { $pull: { items: { product: rawProductId } } },
//         { new: true }
//       );
//     }

//     res.status(200).json({ 
//       success: true, 
//       message: currentItem.quantity > 1 ? "Item quantity decremented safely." : "Item removed from collection completely.",
//       cart: updatedCart 
//     });

//   } catch (error) {
//     console.error("Remove/Decrement Item Error: ", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

cartRouter.delete('/api/cart/remove-item', async (req, res) => {
  try {
    const rawUserId = req.body?.userId || req.query?.userId || req.user?.id;
    const rawProductId = req.body?.productId || req.query?.productId || req.body?.id || req.query?.id;

    if (!rawUserId || !rawProductId) {
      return res.status(400).json({ 
        success: false, 
        message: "Both User ID and Product ID are required." 
      });
    }

    let parsedUserId = new mongoose.Types.ObjectId(rawUserId);

    // 1. Fetch the document directly
    const cart = await Cart.findOne({ userId: parsedUserId });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart document not found." });
    }

    // 2. Pinpoint the item index array position
    const itemIndex = cart.items.findIndex(item => item.product.toString() === rawProductId.toString());

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Selected item not found inside cart array." });
    }

    let message = "";
    
    // 3. Mutate array explicitly to ensure safety against race conditions
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1; // Explicitly drop exactly by 1
      message = "Item quantity decremented safely.";
    } else {
      cart.items.splice(itemIndex, 1); // Splice cleanly drops the whole object block
      message = "Item removed from collection completely.";
    }

    // 4. Atomic save execution snapshot
    const updatedCart = await cart.save();

    res.status(200).json({ 
      success: true, 
      message: message,
      cart: updatedCart 
    });

  } catch (error) {
    console.error("Remove/Decrement Item Error: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



// module.exports = cartRouter;
export default cartRouter;