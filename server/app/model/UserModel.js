const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    dateOfBirth: {
      type: Date,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model('users', UserSchema)
module.exports = UserModel
