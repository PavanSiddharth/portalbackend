const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    type: { type: String, required: false, default: "USER" },
    profilePic: { type: String },
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    slots:  { type: Object }
});

module.exports = mongoose.model('User', userSchema);