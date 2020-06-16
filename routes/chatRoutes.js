const express = require('express');

const { Expert,User,Slot,Chat } = require('../models');

const router = express.Router();

router.post('/',async (req, res) => {
    try {
        var messageList = [];
        if(req.body.message!="")
        {
        console.log(req.body);
        const chatinfo = new Chat({
            sender: req.body.sender,
            receiver: req.body.receiver,
            message: req.body.message
        })
        chatinfo.save().then(async function(doc){
            const chat = await Chat.find({ $or : [ { "sender": req.body.sender }, { "sender": req.body.receiver} ] })

    
            const senderName = (await User.findById(req.body.sender)).name
            const receiverName = (await User.findById(req.body.receiver)).name
        
        
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
            res.send({messageList})
            console.log("This is the messageList")
            console.log(messageList)
        
        })}
        
        else{
            const chat = await Chat.find({ $or : [ { "sender": req.body.sender }, { "sender": req.body.receiver} ] })

    
            const senderName = (await User.findById(req.body.sender)).name
            const receiverName = (await User.findById(req.body.receiver)).name
        
        
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
            res.send({messageList})
            console.log("This is the messageList")
            console.log(messageList)
        }

   

    }catch(error){
        console.log(error)
    }
        
})

module.exports = router;
