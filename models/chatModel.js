const mongoose = require('mongoose');
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema({
    expertId : { type: Schema.Types.ObjectId, ref: 'User', required: true, default: null},
    userId : {type: Schema.Types.ObjectId, ref: 'User', required: true, default: null},
    slotId: {type: Schema.Types.ObjectId, ref: 'Slot', required: true, default: null},
    expertName: String,
    userName: String,
    slotTimings: String,
    chat : [{
        authorId : { type: Schema.Types.ObjectId, ref: 'User'},
        author: String,
        message: String,
        timestamp: { type: Schema.Types.Date, default: Date.now() },
    }]
})

module.exports = mongoose.model('Chat', chatSchema);