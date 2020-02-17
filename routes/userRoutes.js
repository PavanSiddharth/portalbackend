const express = require('express');

const { User, Slot } = require('../models');

const router = express.Router();

router.get('/appointments', async (req, res) => {
    const user = await User.findById(req.user._id);
    const appointments = { 
        prev: [],
        upcoming : [],
        pending : []
    };
    const today = new Date()
    const bookedSlots = user.bookedSlots;
    for(let i=0; i<bookedSlots.length; i++){
        const slot = await Slot.findById(bookedSlots[i]);
        const expert = await User.findById(slot.expertId);
        if(slot.approved === false) {
            appointments.pending.push(expert);
        }
        else if (slot.Date < today) {
            appointments.prev.push(expert);
        }
        else {
            appointments.upcoming.push(expert);
        }
    }
    res.json(expert);
})
