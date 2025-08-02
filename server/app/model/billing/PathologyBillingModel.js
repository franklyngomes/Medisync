const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 5); // 6-char alphanumeric

const PathologyBillSchema = new Schema(
  {
    billNo: {
      type: String,
      unique: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "pathologytests",
      required: true,
    },
    referenceDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
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
    deleted: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now()
    }
  },
  { timestamps: true }
);

PathologyBillSchema.pre("validate", async function (next) {
  if (!this.billNo) {
    this.billNo = `PAT-${nanoid()}`;
  }
});
const PathologyBillModel = mongoose.model("pathologyBill", PathologyBillSchema);
module.exports = PathologyBillModel;
