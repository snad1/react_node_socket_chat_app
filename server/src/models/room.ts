import mongoose from "mongoose"

const schema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    unique: true
  }
})
schema.index({ name: 1})

const RoomModel = mongoose.model("rooms", schema)

export default RoomModel