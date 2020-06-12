const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema({
    sender:{type:String},
    receiver:{type:String},
    message:{type: String}
    },
    { timestamps:true }
)

module.exports = mongoose.model("Chat", chatSchema);
