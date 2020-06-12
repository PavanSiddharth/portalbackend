const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema({
    from:{type: String,required: true},
    userid:{type:String},
    expertid:{type:String},
    message:{type: String}
    },
    { timestamps:true }
)

module.exports = mongoose.model("Chat", chatSchema);
