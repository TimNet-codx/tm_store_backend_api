// const express = require('express');
// const User = require('../models/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// import authMiddleware from '../middleware/authMiddleware.js';

// const authRouter = express.Router();

// // Signup api Endpoint
// authRouter.post('/api/signup', async(req, res) => {
//     try{
//       const {fullName, email, password} = req.body;

//       const existingUserEmail =await User.findOne({email});
//       if(existingUserEmail){
//         return res.status(400).json({msg: "User with same email already exists!"});  
//       } else {
//         // Hash the password before saving it to the database
//         // Generate a salt and hash the password
//         const salt = await bcrypt.genSalt(10);
//         // Hash the password with the generated salt
//         const hashedPasseord = await bcrypt.hash(password, salt);
//         // Create a new user instance with the hashed password
//        var user = new User({fullName, email, password: hashedPasseord});
//        user = await user.save();
//        res.json(user);
//       }
//     } catch(e){
//        res.status(500).json({error: e.message});

//     }
// });

// // Signin api Endpoint
// authRouter.post('/api/signin', async(req, res) => {
//   try{
//     const {email, password} = req.body;
    
//     const findUser = await User.findOne({email});
//     if(!findUser){
//       return res.status(400).json({msg: "User with this email does not exist!"})
//     } else{
//       const isMatch = await bcrypt.compare(password, findUser.password);
//       if(!isMatch){
//         return res.status(400).json({msg: "Incorect password!"});
//       }else{
//         const token = jwt.sign({id: findUser._id}, "passwordKey");

//         // Exclude password from the response, Remove  Sensitive information
//         const { password, ...userWithoutPassword } = findUser._doc;

//         // Return the token and user data without the password
//         // res.json({token, ...userWithoutPassword});
//         res.json({token, user: userWithoutPassword});
 
//       }
//     }

//   }catch(e){
//     res.status(500).json({error: e.message});
//   }
// });


// // Get User Data
// // Get User Full Name and Email
// // authRouter.get('/api/userDetails', async (req, res) => {
// //   try {
// //     const authHeader = req.headers.authorization;

// //     if (!authHeader) {
// //       return res.status(401).json({ msg: "No token provided!" });
// //     }

// //     // Bearer <token>
// //     const token = authHeader.split(" ")[1];

// //     const decoded = jwt.verify(token, "passwordKey");

// //     // Fetch ONLY fullName and email
// //     const user = await User.findById(decoded.id)
// //       .select("fullName email");

// //     if (!user) {
// //       return res.status(404).json({ msg: "User not found!" });
// //     }

// //     res.status(200).json({
// //       fullName: user.fullName,
// //       email: user.email
// //     });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ msg: "Server error" });
// //   }
// // });

// authRouter.get('/api/userDetails', authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId)
//       .select("fullName email");

//     if (!user) {
//       return res.status(404).json({ msg: "User not found!" });
//     }

//     res.status(200).json(user);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// module.exports = authRouter;

import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();

// ================= SIGNUP =================
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { fullName, email, password, country, state, city, street, postalCode, phoneNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with same email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user = new User({
      fullName,
      email,
      password: hashedPassword,
      country,
      state,
      city,
      street,
      phoneNumber,
      postalCode
    });

    user = await user.save();

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      country: user.country,
      state: user.state,
      city: user.city,
      phoneNumber: user.phoneNumber,
      street: user.street,
      postalCode: user.postalCode
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ================= SIGNIN =================
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User with this email does not exist!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password!" });
    }

    const token = jwt.sign({ id: user._id }, "passwordKey");

    res.json({
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ================= GET LOGGED-IN USER =================
// authRouter.get("/api/userDetails", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId)
//       .select("fullName email");

//     if (!user) {
//       return res.status(404).json({ msg: "User not found!" });
//     }

//     res.json(user);

//   } catch (error) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });


// authRouter.get('/api/userDetails', authMiddleware, async (req, res) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//       return res.status(401).json({ msg: "No token provided!" });
//     }

//     // Bearer <token>
//     const token = authHeader.split(" ")[1];

//     const decoded = jwt.verify(token, "passwordKey");

//     // Fetch ONLY fullName and email
//     const user = await User.findById(decoded.id)
//       .select("fullName email");

//     if (!user) {
//       return res.status(404).json({ msg: "User not found!" });
//     }

//     res.status(200).json({
//       fullName: user.fullName,
//       email: user.email
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ msg: "Server error" });
//   }
// });



authRouter.get('/api/userDetails', authMiddleware, async (req, res) => {
  try {
    // The userId was attached to the request by the middleware
    const user = await User.findById(req.userId).select("fullName email country state city street postalCode phoneNumber");

    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    // Return the user data
    return res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      country: user.country,
      state: user.state,
      city: user.city,
      street: user.street,
      postalCode: user.postalCode,
      phoneNumber: user.phoneNumber
    });

  } catch (error) {
    console.error("UserDetails Error:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
});

authRouter.put('/api/AddOrUpdateUserDetails', authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      country,
      state,
      city,
      street,
      postalCode,
      phoneNumber
    } = req.body;

    // Build an update object with only the fields that were actually sent
    const updateFields = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (country !== undefined) updateFields.country = country;
    if (state !== undefined) updateFields.state = state;
    if (city !== undefined) updateFields.city = city;
    if (street !== undefined) updateFields.street = street;
    if (postalCode !== undefined) updateFields.postalCode = postalCode;
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ msg: "No fields provided to update!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("fullName email country state city street postalCode phoneNumber");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found!" });
    }

    return res.status(200).json({
      msg: "User details updated successfully!",
      user: {
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        country: updatedUser.country,
        state: updatedUser.state,
        city: updatedUser.city,
        street: updatedUser.street,
        postalCode: updatedUser.postalCode,
        phoneNumber: updatedUser.phoneNumber
      }
    });

  } catch (error) {
    console.error("UpdateUserDetails Error:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
});



export default authRouter;