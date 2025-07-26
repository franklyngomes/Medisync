const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OPDBillingSchema = new Schema(
  {
    type: {
      type: String,
      default: "OPD",
    },
    outPatientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "outpatients",
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

const OPDBillingModel = mongoose.model(
  "OPDBill",
  OPDBillingSchema
);
module.exports = OPDBillingModel;
