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
      ref: "outpatient",
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
    },
    appliedCharge: {
      type: Number,
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
      default:18
    },
    amount: {
      type: Number,
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

const OPDBillingModel = mongoose.model("opdbills", OPDBillingSchema);
module.exports = OPDBillingModel;
