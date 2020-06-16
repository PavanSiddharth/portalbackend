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
module.exports = router;