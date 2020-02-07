const express = require('express');

const { User } = require('../models');

const router = express.Router();

router.get('/bookslot', async (req, res) => {
    const { slot } = req.body;
    const expert = await User.findById(slot.expert);
    expert.slots[slot.date][slot.time] = req.user._id;
    const updatedExpert = await expert.save();

    const user = await User.findById(req.user._id);
    user.slot[slot.date][slot.time] = slot.expert;
    const updatedUser = await user.save();
})