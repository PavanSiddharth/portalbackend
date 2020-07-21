const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new mongoose.Schema({
  expertId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: null,
  },
  userIds: {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
    messages: [
      {
        message: String,
        sentOn: Date,
        sentAt: String,
        sentByExpert: Boolean,
      },
    ],
  },
});

module.exports = mongoose.model("Chat", chatSchema);
