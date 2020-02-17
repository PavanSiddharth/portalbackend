const express = require('express');

const { User, Slot } = require('../models');

const router = express.Router();

router.get('/getslots', async (req, res) => {
    const fetchedBookedSlots = await Slot.find({ expertId : req.user._id})
    const bookedSlots = {};
    for(let i=0; i<fetchedBookedSlots.length; i++) {
        const date = fetchedBookedSlots[i].date;
        const slot = fetchedBookedSlots[i].slot;
        const id = fetchedBookedSlots[i]._id;
        if (bookedSlots[date] === undefined) bookedSlots[date] = {};
        bookedSlots[date][slot] = id;
    }
    res.json(bookedSlots);
})

router.post('/addslots', async (req, res) => {
    const expert = await User.findOneAndUpdate({_id: req.user._id}, {
        slots: req.body,
    })
    expert.save();
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
