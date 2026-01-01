// model/ApplicationModel.js
const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    // Kis user ne form fill kiya
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    // Kis course ke liye apply kiya (ref: CourseModel)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },

    // Basic student details
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
  gender: {
  type: String,
  required: true,
  enum: ['male', 'female', 'other'],  // 👈 yahan lowercase
},
    // form se "yyyy-mm-dd" string aaye to bhi Mongoose Date me cast kar lega
    dob: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },

    college: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },

    // Status + comment (admin ke liye useful)
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    comment: {
      type: String,
      default: "Wait",
      trim: true,
    },
  },
  { timestamps: true }
);

const ApplicationModel = mongoose.model("application", ApplicationSchema);

module.exports = ApplicationModel;
