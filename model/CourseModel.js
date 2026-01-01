// model/CourseModel.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    branch: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    duration: { type: String, default: "3 Years", trim: true },
    seats: { type: Number, default: 60 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Export with correct name
const CourseModel = mongoose.model("course", CourseSchema);

module.exports = CourseModel;
