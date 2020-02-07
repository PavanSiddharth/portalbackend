const express = require('express');

const { User } = require('../models');

const router = express.Router();

router.get('/getslots', async (req, res) => {
    const slots = await User.findById({_id : req.user._id}, ['slots']);
    res.json(slots);
})

router.post('/addslots', async (req, res) => {
    const { slots } = req.body;
    await User.findByIdAndUpdate(
        { _id : req.user._id },
        { slots : slots},
        (err, res) => {
            if(err) {
                console.log(err);
            }
            else {
                console.log("SUCCESS!");
            }
        }
    )
})

router.get('/bookslot', async (req, res) => {
    const { slot } = req.body;
    const expert = await User.findById(slot.expert);
    expert.slots[slot.date][slot.time] = req.user._id;
    const updatedExpert = await expert.save();

    const user = await User.findById(req.user._id);
    user.slot[slot.date][slot.time] = slot.expert;
    const updatedUser = await user.save();
})

module.exports = router;
