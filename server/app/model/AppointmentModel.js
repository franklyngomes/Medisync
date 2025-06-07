const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId, ref:"patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId, ref:'doctor',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum:["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AppointmentModel = mongoose.model("appointment", AppointmentSchema);
module.exports = AppointmentModel;
