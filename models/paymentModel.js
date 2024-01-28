const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema({
    visitedCheckoutPage: { 
		type: Boolean, 
		default: false 
	},
	IspaymentDone:{
		type:Boolean,
		default:false
	},
	checkOutTime:{
		type:Date,
		default:Date.now()
	},
	user:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
		
	}
	
}, { versionKey: false })



const PaymentModel = mongoose.model('Payment', paymentSchema)

module.exports = {
	PaymentModel
}