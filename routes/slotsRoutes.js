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

router.post('/getexpertslots',async(req,res) => {
    const expertID = req.body.expertID;
    try 
    {
        const expertSlots = await User.findById(expertID,
            ['slots']
          )
          res.json(expertSlots)
    }
    catch(error)
    {
        console.log(error);
    }
})

router.post('/deleteslots',async(req,res) => {
    const expertID = req.body.expertID;
    const slots = req.body.slots
    console.log(slots)
    try 
    {
        const expertSlots = await User.findById(expertID,
            ['slots']
          )
          console.log(expertSlots.slots)
          let modifiedslots = expertSlots.slots
          slots.map((slot) => {
              let date = slot.slice(0,10)
              let time = slot.slice(11,)
              delete modifiedslots[date][time]
          })
          console.log(modifiedslots)
          const response = await User.findByIdAndUpdate(expertID, {
            slots : modifiedslots,
        } , { new:true })
          res.json(response)
    }
    catch(error)
    {
        console.log(error);
    }
})

router.post('/addslots', async (req, res) => {
    const expertSlots = await User.findById(req.user._id,
        ['slots']
      )
      console.log(expertSlots)
    let slots = {...req.body, ...expertSlots.slots};
    const expert = await User.findOneAndUpdate({_id: req.user._id}, {
        slots: slots,
    })

    console.log(expert);
    expert.save();
})

router.post('/copyslots', async (req, res) => {
    let slots = null;
    let modifiedslots;
    console.log(req.body.date);
    const date = req.body.date;
    const prevday = date.split('/')[1] - 1;
    let prevdate = date.split('/')[0]+'/'+prevday+'/'+date.split('/')[2]
    console.log(req.user._id)
    console.log(prevdate);
    const expertSlots = await User.findById(req.user._id,
        ['slots']
      )
      console.log(expertSlots.slots)
      for(i in expertSlots.slots)
      {
          if(i===prevdate)
          {
            slots = expertSlots.slots[i]
          }
      }
      if(slots!==null)
      {
        res.json(slots);
      }
      else
      {
          res.json({message:"No slots selected for previous day"});
      }
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
        if(expert.bookedSlots === undefined) expert.bookedSlots = [];
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

router.post('/approve', async (req, res) => {
    try {
        const slot = await Slot.findByIdAndUpdate(req.body.id, {
            approved : true,
        })
        const approvedSlot = await slot.save();
        res.json(approvedSlot);
    } catch (error) {
        console.log(error)
    }
})


router.post('/reschedule', async (req, res) => {
    try {
        const slot = await Slot.findByIdAndUpdate(req.body.id, {
            slot : req.body.slot,
            approved : true
        })
        const rescheduledSlot = await slot.save();
        console.log(rescheduledSlot)
        res.json(rescheduledSlot);
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

        console.log(5, slot, slot.$isDeleted());
        console.log(updatedExpert);
        console.log(updatedUser); 

        res.json(slot);
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;
