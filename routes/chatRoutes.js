const express = require('express');

const { Chat } = require('../models/chatModel');

const router = express.Router();

router.get('/chats',async (req, res) => {
    try {

        const chatinfo = new Chat({
            from: req.body.type,
            userid: req.body.userid,
            expertid: req.body.expertid,
            message: req.body.message
        })
        chatinfo.save()

    }catch(error){
        console.log(error)
    }
        
})

module.exports = router;
