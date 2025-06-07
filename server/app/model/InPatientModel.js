const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InPatientSchema = new Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      require: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
      require: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
    },
    admissionDate: {
      type: Date,
      require: true,
    },
    dischargeDate: {
      type: Date,
      require: true,
    },
    diagnosis: {
      type: String,
      require: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const InPatientModel = mongoose.model("inpatient", InPatientSchema);
module.exports = InPatientModel;
