const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentBillingSchema = new Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
    chargeType: {
      type: String,
      enum: ["consultation", "surgery"],
      required: true,
    },
    noOfHour: {
      type: Number,
      default:1,
      required: true,
    },
    standardCharge: {
      type: Number,
    },
    appliedCharge: {
      type: Number,
    },
    discount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 18,
    },
    amount: {
      type: Number,
    },
    source: {
      type: String,
      enum: ["Online", "Offline"],
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Cash", "Card"],
      required: true
    },
    status: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AppointmentBillingModel = mongoose.model(
  "appointmentBill",
  AppointmentBillingSchema
);
module.exports = AppointmentBillingModel;
