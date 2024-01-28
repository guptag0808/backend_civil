
const nodemailer = require('nodemailer');
const {UserModel} = require("../models/userModel")
const {PaymentModel} = require("../models/paymentModel")
require('dotenv').config()
const transporter = nodemailer.createTransport({
  service:"gmail",
   auth: { 
      user: 'aditya746287@gmail.com',
      pass: process.env.mailKey,
  }
}); 
const sendInactiveUsersNotification = (io) => async () => {
  try {
    const inactiveUsers = await UserModel.find({ lastActive: { $lt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) } });
   
    
    inactiveUsers.forEach(async (user) => {
      // Trigger in-app notification  
     
      io.emit('inactiveUsersNotification', { userId: user._id, message: 'You have not used the application for more than 5 days. Please login to stay active.' });
       
      // Trigger email notification  
      const mailOptions = {
        from: 'aditya746287@gmail.com' ,
        to: user.email,
        subject: 'Inactive User Notification',
        text: 'You have not used the application for more than 5 days. Please login to stay active.',
      };

       transporter.sendMail(mailOptions,function(error,info){
        if(error){
          console.log(err)
        }else{
          console.log(info)
        }
      });
    });
  } catch (error) {
    console.error('Error sending inactive users notification:', error);
  }
}
 
const sendAbandonedCourseNotification = (io) => async () => {
  try {
    const abandonedCoursesUsers = await PaymentModel.find({
      visitedCheckoutPage: true,
      isPaymentDone: false, 
      lastActive: {  $lt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 ) }
    });

    abandonedCoursesUsers.forEach(async (user) => {
      // Trigger in-app notification
      io.emit('abandonedCourseNotification', { userId: user._id, message: 'You visited the course checkout page but did not proceed to purchase. Complete your purchase now!' });

      // Trigger email notification
      const mailOptions = {
        from: "aditya746287@gmail.com",
        to: user.email,
        subject: 'Abandoned Course Notification',
        text: 'You visited the course checkout page but did not proceed to purchase. Complete your purchase now!',
      };

      await transporter.sendMail(mailOptions);
    });
  } catch (error) {
    console.error('Error sending abandoned course notification:', error);
  }
};

module.exports = {
  sendInactiveUsersNotification,
  sendAbandonedCourseNotification,
};  
