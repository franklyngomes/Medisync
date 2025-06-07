const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PatientSchema = new Schema({
  name: {
    type:String,
    require: true
  },
  gender: {
    type:String,
    enum: ["Male", "Female", "Others"],
    require: true
  },
  address: {
    type:String,
    require: true
  },
  phone: {
    type: String,
    require: true,
  },
  bloodType: {
    type: String,
    require: true
  },
  deleted: {
    type: Boolean,
    default: false
  }
},{timestamps: true})

const PatientModel = mongoose.model('patient', PatientSchema)
module.exports = PatientModel