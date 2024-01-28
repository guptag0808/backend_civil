const express= require('express')
const {UserModel} = require('../models/userModel')
const userRouter = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()
// Signup route
 userRouter.post('/signup',async (req, res) => {
	const { name, email, password } = req.body;
        
	
	try {
		if(!name || !email || !password  ){
			return res.status(422).send({error:"Please add all the fields"})
		}
	  // Check if the user with the given email already exists
	  const existingUser = await UserModel.findOne({ email });
  
	  if (existingUser) {
		return res.status(409).json({ error: 'User with this email already exists' });
	  }
  
	  const hashedPassword = await bcrypt.hash(password, 10);
  
	  const user = new UserModel({
		name,
		email,
		password: hashedPassword,
	  });
  
	  await user.save();
  
	  res.status(201).json({ "msg": 'User created successfully' });
	} catch (error) {
		console.log(error.message)
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  })

  //Login Routes
  userRouter.post('/login', async (req, res) => {
	const { email, password } = req.body;
     const lastActive= new Date(Date.now())
	//  console.log(Date.now())
	//  console.log(lastActive)
	try {
	  const user = await UserModel.findOne({ email });
            
	  if (!user) {
		return res.status(401).json({ error: 'Invalid email or password' });     
	  }	  
	  const passwordMatch = await bcrypt.compare(password, user.password);
       if (!passwordMatch) {
		return res.status(401).json({ error: 'Invalid email or password' });  
	  }
	  await UserModel.findByIdAndUpdate(
		user._id,
		{ $set: { lastActive} },
		{ new: true }
	  )
	  const token = jwt.sign({ userId: user._id }, process.env.key, {
		expiresIn: '5d', // Token expires in 1 hour
	  });
       const {_id,name}= user
	  res.status(200).send({ "msg":"Login Successfull","Token":token, user:{_id,name}});
	} catch (error) {
		console.log(error.message)
	  res.status(500).json({ error: error.message});
	}
  });
   
  module.exports={
	userRouter
  }
