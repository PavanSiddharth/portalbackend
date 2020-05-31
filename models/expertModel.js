const mongoose = require('mongoose');
const { Schema } = mongoose;

const expertSchema = new mongoose.Schema({
    expertId : { type: Schema.Types.ObjectId, ref: 'User', required: true, default: null},
    users : {type: Object},
    call_count : {type: Number, default: 0},
    amount : {type: Number, default: 0}
});

module.exports = mongoose.model('Expert', expertSchema);