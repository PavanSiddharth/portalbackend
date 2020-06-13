const express = require('express');

const { Expert,User,Slot,Chat } = require('../models');

const router = express.Router();

router.post('/',async (req, res) => {
    try {
        const messageList = [];
        console.log(req.body);
        const chatinfo = new Chat({
            sender: req.body.sender,
            receiver: req.body.receiver,
            message: req.body.message
        })
        chatinfo.save()

    const chat = await Chat.find({ "sender": req.body.sender})
    const senderName = (await User.findById(req.body.sender)).name
    const receiverName = (await User.findById(req.body.receiver)).name
    console.log(chat)

    for(let i=0; i<chat.length; i++){
        const currentChat = chat[i]
        const currentblock = {
            "text": currentChat.message,
            "id": currentChat._id,
            "sender":{
                "name":senderName,
                "uid": currentChat.sender
            },
            "receiver":{
                "name": receiverName,
                "uid": currentChat.receiver
            }
        }
        messageList.push(currentblock)
    }
    res.send({messageList})
    console.log("This is the messageList")
    console.log(messageList)


    }catch(error){
        console.log(error)
    }
        
})

module.exports = router;
