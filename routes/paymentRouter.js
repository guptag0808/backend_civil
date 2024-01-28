const express= require("express")
const {authentication} = require("../middleware/authentication")
const paymentRouter= express.Router()
const {PaymentModel} =require("../models/paymentModel")
paymentRouter.post("/checkout",authentication,async(req,res)=>{
	const user=req.user
	const checkOutTime = new Date(Date.now())
	try{
		const isUserAlreadyPresent = await PaymentModel.findOne({
			user: user._id,
			visitedCheckoutPage: true,   
		  });
		if(!isUserAlreadyPresent){
			const paymentUpdate= new PaymentModel({visitedCheckoutPage:true,checkOutTime,user})
			await paymentUpdate.save()
		}
        res.status(200).send({"msg":"Procced to checkout"})
	}catch(err){
		console.log(err.message)
	}
})
 
paymentRouter.patch("/complete",  authentication, async (req, res) => {
	try {
	  const userId = req.user._id; 
	  const payment = await PaymentModel.findOne({ user: userId });
      
	  if (!payment) {
		 
		return res.status(404).json({ message: 'Payment document not found for the user' });
	  }
  
	  // Update the isPaymentDone field to true
	  PaymentModel.isPaymentDone = true;
	  
	  await payment.save();
  
	  res.status(200).json({ msg: 'Payment successfully updated' });
	} catch (err) {
	  console.log(err.message);
	  res.status(500).json({ message: 'Internal Server Error' });
	}
  });

   
module.exports={paymentRouter}
