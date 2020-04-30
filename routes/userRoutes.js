const express = require('express');

const { User, Slot } = require('../models');

const router = express.Router();

router.get('/appointments', async (req, res) => {
    try {
        const user = await User.findById(req.user._id, ['bookedSlots', 'wishlist']);
        const appointments = { 
            past: [],
            upcoming : [],
            pending : [],
            wishlist : [],
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
                appointments.past.push(expert);
            }
            else {
                appointments.upcoming.push(expert);
            }
        }
        console.log(1)
        res.json(appointments);
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;