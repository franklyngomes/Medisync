const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorSchema = new Schema(
  {
    doctorName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    specialization: {
      type: String,
      require: true,
    },
    status: {
      type:String,
      enum: ["Available","Unavailable"],
      default:"Unavailable"
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const DoctorModel = mongoose.model('doctor', DoctorSchema)
module.exports = DoctorModel