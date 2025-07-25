const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RadiologyTestSchema = new Schema({
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
      "X-RAY LUMBOSACRAL SPINE AP AND LAT VIEWS",
      "X-RAY CHEST PA VIEW",
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
const RadiologyTestModel = mongoose.model('radiologyTest', RadiologyTestSchema)
module.exports = RadiologyTestModel
