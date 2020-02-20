const express = require('express');

const { User, Slot } = require('../models');

const router = express.Router();

router.get('/getexperts', async (req, res) => {
    const experts = await User.find({type : "EXPERT"})
    res.json(experts);
})

router.post('/edit', async (req, res) => {
    try {
        const updatedExpert = await User.findByIdAndUpdate(req.user._id,
            req.body
            )
        await updatedExpert.save();
        res.json(updatedExpert);
    } catch (error) {
        console.log(error)
        res.json(error)
    }
})

router.get('/appointments', async (req, res) => {
    try {
        const expert = await User.findById(req.user._id, ['bookedSlots']);
        await expert.populate()
        const { bookedSlots } = expert
        const appointments = [];
        for(let i=0; i<bookedSlots.length; i++) {
            const slot = await Slot.findById(bookedSlots[i]);
            const user = await User.findById(slot.userId, ['name', 'pic']);
            appointments.push({ slot, user});
        }
        res.json(appointments);
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;