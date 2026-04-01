const express = require('express');
const Vendor = require('../models/vendor');
const vendorRouter = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup api Endpoint
vendorRouter.post('/api/vendor/signup', async(req, res) => {
    try{
      const {fullName, email, password} = req.body;

      const existingUserEmail = await Vendor.findOne({email});
      if(existingUserEmail){
        return res.status(400).json({msg: "Vendor with same email already exists!"});  
      } else {
        // Hash the password before saving it to the database
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the generated salt
        const hashedPasseord = await bcrypt.hash(password, salt);
        // Create a new user instance with the hashed password
       var vendor = new Vendor({fullName, email, password: hashedPasseord});
       vendor = await vendor.save();
       res.json(vendor);
      }
    } catch(e){
       res.status(500).json({error: e.message});

    }
});

vendorRouter.post('/api/vendor/signin', async(req, res) => {
  try{
    const {email, password} = req.body;
    
    const findVendor = await Vendor.findOne({email});
    if(!findVendor){
      return res.status(400).json({msg: "Vendor with this email does not exist!"})
    } else{
      const isMatch = await bcrypt.compare(password, findVendor.password);
      if(!isMatch){
        return res.status(400).json({msg: "Incorect password!"});
      }else{
        const token = jwt.sign({id: findVendor._id}, "passwordKey");
        // Exclude password from the response, Remove  Sensitive information
        const { password, ...vendorWithoutPassword } = findVendor._doc;

        // Return the token and user data without the password
        // res.json({token, ...userWithoutPassword});
        res.json({token, vendor: vendorWithoutPassword});
 
      }
    }

  }catch(e){
    res.status(500).json({error: e.message});
  }
});

module.exports = vendorRouter;


