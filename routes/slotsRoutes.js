const express = require('express');

const { User, Slot, Chat } = require('../models');

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
        
        const expert = await User.findById(expertId);
        // expert.slots[date][slot] = bookedSlot._id;
        if(expert.bookedSlots === undefined) expert.bookedSlots = [];
        await expert.bookedSlots.push(bookedSlot._id);
        expert.markModified('bookedSlots');
        expert.markModified('slots');
        
        const user = await User.findById(req.user._id);
        if(user.bookedSlots === undefined) user.bookedSlots = [];
        await user.bookedSlots.push(bookedSlot._id);
        user.markModified('bookedSlots');

        const updatedExpert = await expert.save();
        const updatedUser = await user.save();

        res.json(bookedSlot);

    } catch (error) {
        console.log(error)
        res.json(error)
    }
    
})

router.post('/approve', async (req, res) => {
    try {
        const slot = await Slot.findByIdAndUpdate(req.body.id, {
            approved : true,
        })
        const approvedSlot = await slot.save();
        console.log(approvedSlot);
        const expert = await User.findById(approvedSlot.expertId);
        const user = await User.findById(approvedSlot.userId);
        
        const chat = {
            expertId : approvedSlot.expertId,
            userId : approvedSlot.userId,
            slotId : approvedSlot._id,
            expertName : expert.name,
            userName : user.name,
            slotTimings : approvedSlot.slot,
        }
        const newChat = await Chat.create(chat);
        if(expert.chats === undefined) expert.chats = []
        expert.chats.push(newChat._id)
        
        if(user.chats === undefined) user.chats = []
        user.chats.push(newChat._id)
        
        expert.markModified('chats')
        user.markModified('chats')

        const updatedExpert = await expert.save();
        const updatedUser = await user.save();       

        res.json(approvedSlot);
    } catch (error) {
        console.log(error)
    }
})

router.post('/reject', async (req, res) => {
    try {
        const slot = await Slot.findByIdAndRemove(req.body.id);
        
        const user = await User.findById(slot.userId);
        let i = user.bookedSlots.indexOf(slot._id);
        user.bookedSlots.splice(i,1);
        user.markModified('bookedSlots');
        const updatedUser = await user.save();

        const expert = await User.findById(slot.expertId);
        i = expert.bookedSlots.indexOf(slot._id);
        expert.bookedSlots.splice(i,1);
        expert.markModified('bookedSlots');
        const updatedExpert = await expert.save();
        res.json(slot);
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;
