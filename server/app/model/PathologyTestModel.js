const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PathologyTestSchema = new Schema(
  {
    testName: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
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
    },
    reportDays: {
      type: Number,
      required: true,
    },
    charge: {
      type: Number,
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
PathologyTestSchema.pre("save", function (next) {
  if (this.isModified("testName") || !this.slug) {
    this.slug = this.testName
      .split(/[\s\-]+/)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  }
  next();
});
const PathologyTestModel = mongoose.model("pathologytests", PathologyTestSchema);
module.exports = PathologyTestModel;
