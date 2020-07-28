const express = require('express');

const { User, Slot } = require('../models');

const Razorpay = require('razorpay');

const router = express.Router();

let instance = new Razorpay({
    key_id: "rzp_test_4JLpoFGA17xkZq",
    key_secret: "89CUTDzmDYbIYqgpUabjGtav",
  });

router.post('/status',(req,res)=>{
    try{
        var amt;
        var currency;
      const paymentID = req.body.payment_id;
      instance.payments.fetch(paymentID).then((data) => {
          amt = data.amount;
          currency = data.currency;
          instance.payments.capture(paymentID,amt,currency).then((data1) => {
            console.log(data1)
            res.json(data1)
        }).catch((error) => {
          res.json(error);
        });
      }).catch((error) => {
        console.log(error);
      });
     
    }
    catch(error){
      console.log(error);
    }
  })

router.post('/success' , async (req,res) => {
    try{
      console.log("HELLO");
        const userinf = await User.findOne({ type: "USER", _id : req.body.userID })
        const expertinf = await User.findOne({ type: "EXPERT", _id : req.body.expertID})
        console.log(req.body);
        let amt = (req.body.amount)/100;
        const newSlot = await Slot.create({
          expertId:req.body.expertID, 
          userId : req.body.userID,
          slot:req.body.slot,
          Date : req.body.date,
          amount :amt,
          approved:true
      })

      const user = await User.findById(req.body.userID);
        if(user.bookedSlots === undefined) user.bookedSlots = [];
        await user.bookedSlots.push(req.body.expertID);
        user.markModified('bookedSlots');
        const updatedUser = await user.save();

        const expert = await User.findById(req.body.expertID);
        if(expert.bookedSlots === undefined) expert.bookedSlots = [];
        await expert.bookedSlots.push(newSlot._id);
        expert.markModified('bookedSlots');
        const updatedExpert = await expert.save();

      res.json({newSlot:newSlot,updatedExpert:updatedExpert,updatedUser:updatedUser});

        //const newdoc1 =  await User.findByIdAndUpdate( { _id : req.body.expertID } , { amount: amount },{ useFindAndModify :false} )
            //res.send("Changes made in the db")
        var paidarray = userinf.paid
        if(paidarray.indexOf(req.body.expertID) == -1){
            paidarray.push(req.body.expertID)
            const newdoc =  await User.findByIdAndUpdate( { _id : req.body.userID } , { paid: paidarray },{ useFindAndModify :false} )
            //res.send("Changes made in the db")
        }
        
    }
    catch(error){
      console.log(error);
    }
})

module.exports = router;