const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      enum: [
        "Cardiologist",
        "Dermatologist",
        "Oncologist",
        "Pediatrician",
        "Orthopaedist",
        "Pathology",
        "Pulmonologist",
        "Psychiatrist",
        "General Surgery",
        "Obstetrician-gynecologist",
      ],
      required: true,
    },
    fees: {
      consultation: {
        type: Number,
      },
      surgery: {
        type: Number
      }
    },
    status: {
      type: String,
      enum: ["Available", "Unavailable", "On Leave"],
      default: "Available",
    },
    image: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const DoctorModel = mongoose.model("doctor", DoctorSchema);
module.exports = DoctorModel;
