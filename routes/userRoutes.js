const express = require('express');

const { User, Slot } = require('../models');

const router = express.Router();

router.post('/getUser', async (req, res) => {
    const userId = req.body.userId
    const userinf = await User.findById(userId)
    console.log(userinf);
    res.json(userinf)

});

router.post('/profile', async (req, res) => {
    try {
        const expert = await User.findById(req.body.userID, 
            ['type','pic', 'name', 'username', 'email', 'mobile', 'institution', 'branch', 'desc']
        );
        const expert_data = await User.findOne({_id:req.body.userID},function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log(result);
            }
          }); 
        var expert1 = {expert : expert , expert_data:expert_data};
        console.log(expert1);
        res.json(expert1);
    } catch (error) {
        console.log(error);
    }
})

router.post('/appointments', async (req, res) => {

    const userinf = await User.findOne({ type: "USER", _id : req.body.userID})
    var paidarray = userinf.paid;
    var user_wishlist = userinf.wishlist
    console.log(paidarray)
    const user = await User.find({type:"EXPERT"});
    const appointments = { 
        wishlist: [],
        upcoming : [],
        past : []
    };
    console.log(user.length);
    for(let i=0; i<user.length; i++){
        if(user_wishlist.indexOf(user[i]._id) != -1) {
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
