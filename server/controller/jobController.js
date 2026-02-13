const Job = require("../model/Job");

// Create Job
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get All Jobs
exports.getJobs = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = {};

    if (status) query.status = status;

    if (search) {
      query.$text = { $search: search };
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Job
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(job);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Job
exports.deleteJob = async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
