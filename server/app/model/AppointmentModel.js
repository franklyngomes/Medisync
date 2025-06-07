const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema(
  {
    patientName: {
      type: mongoose.Schema.Types.ObjectId, ref:"patient",
      require: true,
    },
    doctorName: {
      type: mongoose.Schema.Types.ObjectId, ref:'doctor',
      require: true,
    },
    appointmentDate: {
      type: Date,
      require: true,
    },
    note: {
      type: String,
      require: true
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
