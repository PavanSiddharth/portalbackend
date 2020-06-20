const express = require('express');

const { User, Slot } = require('../models');

const router = express.Router();

router.post('/appointments', async (req, res) => {

    const userinf = await User.findOne({ type: "USER", _id : req.body.userID})
    var paidarray = userinf.paid;
    console.log(paidarray)
    const user = await User.find({type:"EXPERT"});
    const appointments = { 
        wishlist: [],
        upcoming : [],
        past : []
    };
    console.log(user.length);
    for(let i=0; i<user.length; i++){
        if(user[i].wishlist === true) {
            appointments.wishlist.push(user[i]);
        }
        if(paidarray.indexOf(user[i]._id) != -1){
          appointments.upcoming.push(user[i]);
        }
        if (user[i].past_for_user === true) {
            appointments.past.push(user[i]);
        }
    }
    res.json(appointments);
})
module.exports = router;
