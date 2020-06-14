const express = require('express');

const { User, Slot } = require('../models');

const Razorpay = require('razorpay');

const router = express.Router();

let instance = new Razorpay({
    key_id: "rzp_test_4JLpoFGA17xkZq",
    key_secret: "89CUTDzmDYbIYqgpUabjGtav",
  });
router.get('/', async (req, res) => {
    try {
        var options = {
            amount: 50000,  // amount in the smallest currency unit
            currency: "INR",
            //receipt: "order_rcptid_11",
            payment_capture: '1'
          };
          let result = await instance.orders.create(options)
          res.send(result)
           
          
    } catch (error) {
        console.log(error)
    }
    
})

router.post('/status', async (req, res) => {
    try {
        console.log(req.body);
          
    } catch (error) {
        console.log(error)
    }
    
})
module.exports = router;