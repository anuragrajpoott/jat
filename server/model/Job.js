const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["note", "status_change", "email", "call", "interview"],
      required: true,
    },
    message: {
      type: String,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

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
    activity: [activitySchema],

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

    jobUrl: {
      type: String,
      match: /^https?:\/\/.+/,
    },

    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "USD",
      },
    },

    location: String,
    notes: String,
    appliedDate: Date,
    followUpDate: Date,
  },
  { timestamps: true }
);

// Indexes
jobSchema.index({ status: 1, priority: 1 });
jobSchema.index({ company: "text", role: "text" });

// Middleware
jobSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "applied" && !this.appliedDate) {
      this.appliedDate = new Date();
    }

    this.activity.push({
      eventType: "status_change",
      message: `Status changed to ${this.status}`,
    });
  }

  next();
});

module.exports = mongoose.model("Job", jobSchema);
