import mongoose from "mongoose"

const schema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique : true
  },
  picture: {
    type: String,
    required: true,
  }
})
schema.index({ email: 1})

const UserModel = mongoose.model("users", schema)

export default UserModel