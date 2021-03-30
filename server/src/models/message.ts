import mongoose from "mongoose"

const schema = new mongoose.Schema({
  desc:{
    type: String,
    required: true
  },
  room:{
    type: String,
    required: true,
  },
  owner:{
    type: String,
    required: true,
  }
})

const MessageModel = mongoose.model("messages", schema)

export default MessageModel