const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    expertId : { type: Schema.Types.ObjectId, ref: 'User', required: true},
    userId : {type: Schema.Types.ObjectId, ref: 'User', required: true},
    Date : {type: Date, required: true },
    slot : {type: String, required: true},
    approved : {type: Boolean, default: false}
});

module.exports = mongoose.model('Slot', slotSchema);