const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OPDorIPDBillingSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["OPD", "IPD"],
      required: true,
    },
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
    chargeName: {
      type: String,
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

const OPDorIPDBillingModel = mongoose.model(
  "OPDorIPD Bill",
  OPDorIPDBillingSchema
);
module.exports = OPDorIPDBillingModel;
