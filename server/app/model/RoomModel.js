const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoomSchema = new Schema({
  roomNo: {
    type:String,
    require: true
  },
  roomName: {
    type:String,
    require: true
  },
  roomType: {
    type:String,
    enum: ["General", "Private", "ICU"],
    default: "General"
  },
  status: {
    type: String,
    enum: ["Available", "Occupied", "Maintenance"],
    default: "Available"
  },
  createdAt: {
    type:Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  },
},{timestamps: true})

const RoomModel = mongoose.model('room', RoomSchema)
module.exports = RoomModel