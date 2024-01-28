
const jwt = require('jsonwebtoken')
const {UserModel} = require('../models/userModel')
const authentication  =async(req,res,next)=>{
	const token = req.headers.authorization
	try{
		if(!token){
		return	res.send({"msg":"Please Login First"})
		}
		var decoded = jwt.verify(token, 'secret_key')
		if(decoded){
			const userId = decoded.userId  
			const user = await UserModel.findById(userId)
			 req.userId=userId
			 req.user  = user
			
		}
		next()

	}catch(err){
		res.send(err.message)
	}
}

module.exports={authentication}