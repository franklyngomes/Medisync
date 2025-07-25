const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RadiologyBillSchema = new Schema({
  billNo: {
    type: String,
  },
  caseId: {
    type: String,
  },
  reportingDate: {
    type: String,
    required: true,
  },
  patientName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient",
    required: true,
  },
  referenceDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor",
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    required: true,
  },
  balanceAmount: {
    type: Number,
  },
});
const RadiologyBillModel = mongoose.model('pathologyBill', RadiologyBillSchema)
module.exports = RadiologyBillModel
