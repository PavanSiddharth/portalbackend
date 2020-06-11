const express = require('express');

const { User, Slot } = require('../models');

const router = express.Router();

router.get('/appointments', async (req, res) => {
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
        if (user[i].current_for_user === true) {
            appointments.upcoming.push(user[i]);
        }
        if (user[i].past_for_user === true) {
            appointments.past.push(user[i]);
        }
    }
    res.json(appointments);
})
module.exports = router;
