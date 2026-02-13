const Job = require("../models/Job");

// Create Job
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Jobs (with pagination + search)
exports.getJobs = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (search) query.$text = { $search: search };

    const jobs = await Job.find(
      query,
      search ? { score: { $meta: "textScore" } } : {}
    )
      .sort(
        search
          ? { score: { $meta: "textScore" } }
          : { createdAt: -1 }
      )
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Job.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      jobs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Job
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update Job (safe update)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const allowedUpdates = [
      "company",
      "role",
      "status",
      "priority",
      "source",
      "jobUrl",
      "salary",
      "location",
      "notes",
      "appliedDate",
      "followUpDate",
    ];

    const oldStatus = job.status;

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    if (req.body.status && req.body.status !== oldStatus) {
      job.activity.push({
        eventType: "status_change",
        message: `Status changed from ${oldStatus} to ${req.body.status}`,
      });
    }

    const updatedJob = await job.save();
    res.json(updatedJob);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job deleted successfully" });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
