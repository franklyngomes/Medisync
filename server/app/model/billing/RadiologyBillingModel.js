const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 5);

const RadiologyBillSchema = new Schema(
  {
    billNo: {
      type: String,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    referenceDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "radiologyTest",
      required: true,
    },
    discount: {
      type: Number,
      required: true,
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
    tax: {
      type: Number,
      default: 18,
    },
    invoice: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now()
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
RadiologyBillSchema.pre("validate", async function (next) {
  if (!this.billNo) {
    this.billNo = `RAD-${nanoid()}`;
  }
});
const RadiologyBillModel = mongoose.model("radiologyBill", RadiologyBillSchema);
module.exports = RadiologyBillModel;
