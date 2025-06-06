const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema(
  {
    patientName: {
      type: String,
      require: true,
    },
    doctorName: {
      type: String,
      require: true,
    },
    appointmentDate: {
      type: Date,
      require: true,
    },
    status: {
      type: String,
      default: null,
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
