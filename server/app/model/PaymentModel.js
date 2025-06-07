const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PaymentSchema = new Schema({
  patient: {
    type:mongoose.Schema.Types.ObjectId, ref: "patient",
    require: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId, ref: "appointment",
  },
  notes: {
    type:String,
    require: true
  },
  amount: {
    type: Number,
    require: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Pending", "Failed"],
    default: "Pending"
  },
  date: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  }
},{timestamps: true})

const PaymentModel = mongoose.model('payment', PaymentSchema)
module.exports = PaymentModel