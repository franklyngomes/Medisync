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
  },
  category: {
    type: String,
    enum: [
      "X-RAY LUMBOSACRAL SPINE AP AND LAT VIEWS",
      "X-RAY CHEST PA VIEW",
    ],
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
  deleted: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});
RadiologyTestSchema.pre("save", function (next) {
  if (this.isModified("testName") || !this.slug) {
    this.slug = this.testName
      .split(/[\s\-]+/)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  }
  next();
});
const RadiologyTestModel = mongoose.model('radiologyTest', RadiologyTestSchema)
module.exports = RadiologyTestModel
