const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "saved",
        "applied",
        "screening",
        "interview",
        "final",
        "offer",
        "rejected",
        "ghosted",
      ],
      default: "saved",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    source: String,
    jobUrl: String,
    salary: String,
    location: String,
    notes: String,
    appliedDate: Date,
    followUpDate: Date,
  },
  { timestamps: true }
);

// useful indexes
jobSchema.index({ status: 1 });
jobSchema.index({ priority: 1 });
jobSchema.index({ company: "text", role: "text" });

module.exports = mongoose.model("Job", jobSchema);
