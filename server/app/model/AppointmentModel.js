const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6); // 6-char alphanumeric

const AppointmentSchema = new Schema(
  {
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
    appointmentNo: {
      type: String,
      unique: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled"],
      default: "Scheduled",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
AppointmentSchema.pre("validate", async function (next) {
  if(!this.appointmentNo){
      this.appointmentNo = `APP-${nanoid()}`;
  }
});

const AppointmentModel = mongoose.model("appointment", AppointmentSchema);
module.exports = AppointmentModel;
