const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
    type: { type: String, required: false, default: "USER" },
    pic: { type: String, default: "defaultpic" },
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    slots: { type: Object },
    bookedSlots: { type: Object },
    institution: { type: String },
    branch: { type: String },
    desc: { type: String },
    emailVerified: { type: Boolean, default: false },
    wishlist : {type: Array},
    current_for_user : {type: Boolean, default: false},
    past_for_user : {type: Boolean, default: false},
    paid : { type: Array },
    call_count : {type: Number, default: 0},
    amount : {type: Number, default: 0}
});

module.exports = mongoose.model("User", userSchema);
