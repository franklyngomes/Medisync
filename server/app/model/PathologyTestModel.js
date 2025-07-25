const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PathologyTestSchema = new Schema({
  testName: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
  },
  testType: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Clinical Chemistry",
      "Molecular Diagnostics",
      "Hematology",
      "Clinical Microbiology",
    ],
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  reportDays: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  charge: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});
const PathologyTestModel = mongoose.model('pathologyTest', PathologyTestSchema)
module.exports = PathologyTestModel
