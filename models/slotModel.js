const mongoose = require('mongoose');
const { Schema } = mongoose;

const slotSchema = new mongoose.Schema({
    expertId : { type: Schema.Types.ObjectId, ref: 'User', required: true, default: null},
    userId : {type: Schema.Types.ObjectId, ref: 'User', required: true, default: null},
    Date : {type: Date, required: true },
    slot : {type: String, required: true},
    approved : {type: Boolean, default: false},
    amount : {type:Number,default:0},
    rating : {type:Number,default:0}
});

module.exports = mongoose.model('Slot', slotSchema);