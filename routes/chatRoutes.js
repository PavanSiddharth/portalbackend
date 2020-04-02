const express = require('express');

const { Chat, User } = require('../models');

const router = express.Router();

// router.get('/', async (req, res) => {
//     try {
//         const chat = await Chat.findById(req.body);
//         res.json(chat);
//     } catch (error) {
//         console.log(error);
//     }
// })

router.get('/', async (req, res) => {
    try {
        const chatIds = await User.findById(req.user._id, ['chats']);
        const chats = [];
        console.log(chatIds);
        for(let i=0; i<chatIds.chats.length; i++) {
            const chat = await Chat.findById(chatIds.chats[i]);
            chats.push(chat);
            console.log(chats);
        }
        res.json(chats);
    } catch (error) {
        
    }
})

router.post('/send', async (req, res) => {
    try {
        const { message, chatId } = req.body;
        const chat = await Chat.findById(chatId);
        chat.chat.push(message);
        chat.markModified(chat);
        const newChat = chat.save();
        res.json(newChat);
    } catch (error) {
        
    }
})

module.exports = router