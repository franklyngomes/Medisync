const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentBillingSchema = new Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      required: true,
    },
    chargeType: {
      type: String,
      enum: ["consultation", "surgery"],
      required: true,
    },
    noOfHour: {
      type: Number,
      required: true,
    },
    standardCharge: {
      type: Number,
      required: true,
    },
    appliedCharge: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      default: 18
    },
    amount: {
      type: Number,
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
