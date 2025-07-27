const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IPDBillingSchema = new Schema(
  {
    type: {
      type: String,
      default: "IPD",
    },
    inPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "inpatients",
      required: true,
    },
    chargeName: {
      type: String,
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
    source: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["UPI", "Cash", "Card"],
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

const IPDBillingModel = mongoose.model("ipdbills", IPDBillingSchema);
module.exports = IPDBillingModel;
