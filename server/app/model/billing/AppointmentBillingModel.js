const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentBillingSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    chargeType: {
      type: String,
      enum: ["consultation", "surgery"],
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    standardCharge: {
      type: Number,
      required: true,
    },
    tpaCharge: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
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
  "payment",
  AppointmentBillingSchema
);
module.exports = AppointmentBillingModel;
