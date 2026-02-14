const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "saved",
        "applied",
        "shortlisted",
        "interview",
        "offer",
        "rejected",
      ],
      default: "saved",
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
      index: true,
    },

    location: {
      type: String,
      trim: true,
    },

    ctc: {
      type: Number,
      min: 0,
    },

    source: {
      type: String,
      trim: true,
    },

    referred: {
      type: Boolean,
      default: false,
    },

    resume: {
      type: String,
      trim: true,
    },

    jobUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // allow empty
          return /^https?:\/\/.+/.test(v);
        },
        message: "Invalid URL format",
      },
    },

    notes: {
      type: String,
      trim: true,
    },

    appliedDate: {
      type: Date,
      index: true,
    },

    followUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

/*
  Auto-set appliedDate:
  - On create
  - On update (findOneAndUpdate)
*/

// For .save()
jobSchema.pre("save", function () {
  if (this.status === "applied" && !this.appliedDate) {
    this.appliedDate = new Date();
  }
});

// For findOneAndUpdate()
jobSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();

  if (!update) return;

  if (update.status === "applied" && !update.appliedDate) {
    update.appliedDate = new Date();
  }
});

module.exports = mongoose.model("Job", jobSchema);
