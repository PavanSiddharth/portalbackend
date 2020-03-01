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
    console.log(expert);
    expert.save();
})

router.post('/bookslot', async (req, res) => {
    const { slot, expertId, date } = req.body;
    try {
        const bookedSlot = await Slot.create({
            expertId, slot,
            Date : date,
            userId : req.user._id,
        })
        console.log(bookedSlot)
        
        const expert = await User.findById(expertId);
        // expert.slots[date][slot] = bookedSlot._id;
        if(expert.bookedSlots === undefined) expert.bookedSlot = [];
        await expert.bookedSlots.push(bookedSlot._id);
        expert.markModified('bookedSlots');
        expert.markModified('slots');
        const updatedExpert = await expert.save();
        
        const user = await User.findById(req.user._id);
        if(user.bookedSlots === undefined) user.bookedSlots = [];
        await user.bookedSlots.push(bookedSlot._id);
        user.markModified('bookedSlots');
        const updatedUser = await user.save();
        res.json(bookedSlot);
    } catch (error) {
        console.log(error)
        res.json(error)
    }
    
})

module.exports = router;
