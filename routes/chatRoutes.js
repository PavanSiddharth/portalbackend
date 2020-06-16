const express = require('express');

const { Expert,User,Slot,Chat } = require('../models');

const router = express.Router();

router.post('/',async (req, res) => {
    try {
        if(req.body.message != ''){
        var messageList = [];
        console.log(req.body);
        const chatinfo = new Chat({
            sender: req.body.sender,
            receiver: req.body.receiver,
            message: req.body.message
        })
        chatinfo.save()
        
    const chat = await Chat.find({ $or : [ { "sender": req.body.sender }, { "sender": req.body.receiver} ] })

    
    const senderName = (await User.findById(req.body.sender)).name
    const receiverName = (await User.findById(req.body.receiver)).name
    console.log(chat)

    for(let i=0; i<chat.length; i++){
        var currentChat = chat[i]
        var currentblock = {}
        if(currentChat.sender == req.body.sender){
             currentblock = {
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
        }
        else{
             currentblock = {
                "text": currentChat.message,
                "id": currentChat._id,
                "sender":{
                    "name":receiverName,
                    "uid": currentChat.sender
                },
                "receiver":{
                    "name": senderName,
                    "uid": currentChat.receiver
                }
            }
        }
    messageList.push(currentblock)
    }
    

    const updatedchat = await Chat.find({ $or : [ { "sender": req.body.sender }, { "sender": req.body.receiver} ] })

    var currentmessage = {
        "text": req.body.message,
        "id": updatedchat[updatedchat.length - 1]._id,
        "sender":{
            "name":senderName,
            "uid": req.body.sender
        },
        "receiver":{
            "name": receiverName,
            "uid": req.body.receiver
        }
    }
    messageList.push(currentmessage)
    
    res.send({messageList})
    console.log("This is the messageList\n\n\n\n")
    console.log(messageList)

        }
    }catch(error){
        console.log(error)
    }
        
})

module.exports = router;
