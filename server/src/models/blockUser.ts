import mongoose from "mongoose"

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  by: {
    type: String,
    required: true,
  }
})
schema.index({ email: 1,by:1})

const BlockedUserModel = mongoose.model("block_users", schema)

export default BlockedUserModel