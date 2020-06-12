const express = require('express');

const { Expert,User,Slot,Chat } = require('../models');

const router = express.Router();

router.post('/',async (req, res) => {
    try {
        console.log(req.body);
        const chatinfo = new Chat({
            sender: req.body.sender,
            receiver: req.body.receiver,
            message: req.body.message
        })
        chatinfo.save()

    }catch(error){
        console.log(error)
    }
        
})

module.exports = router;
