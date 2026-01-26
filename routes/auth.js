const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

// Signup api Endpoint
authRouter.post('/api/signup', async(req, res) => {
    try{
      const {fullName, email, password} = req.body;

      const existingUserEmail =await User.findOne({email});
      if(existingUserEmail){
        return res.status(400).json({msg: "User with same email already exists!"});  
      } else {
        // Hash the password before saving it to the database
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the generated salt
        const hashedPasseord = await bcrypt.hash(password, salt);
        // Create a new user instance with the hashed password
       var user = new User({fullName, email, password: hashedPasseord});
       user = await user.save();
       res.json(user);
      }
    } catch(e){
       res.status(500).json({error: e.message});

    }
});

// Signin api Endpoint
authRouter.post('/api/signin', async(req, res) => {
  try{
    const {email, password} = req.body;
    
    const findUser = await User.findOne({email});
    if(!findUser){
      return res.status(400).json({msg: "User with this email does not exist!"})
    } else{
      const isMatch = await bcrypt.compare(password, findUser.password);
      if(!isMatch){
        return res.status(400).json({msg: "Incorect password!"});
      }else{
        const token = jwt.sign({id: findUser._id}, "passwordKey");

        // Exclude password from the response
        const { password, ...userWithoutPassword } = findUser._doc;

        // Return the token and user data without the password
        res.json({token, ...userWithoutPassword});
 
      }
    }

  }catch(e){
    res.status(500).json({error: e.message});
  }
});

module.exports = authRouter;