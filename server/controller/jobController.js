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
    const existingJob = await Job.findById(req.params.id);

if (!existingJob) {
  return res.status(404).json({ message: "Job not found" });
}

let activityEntry = null;

if (req.body.status && req.body.status !== existingJob.status) {
  activityEntry = {
    type: "status_change",
    message: `Status changed from ${existingJob.status} to ${req.body.status}`,
  };
}

Object.assign(existingJob, req.body);

if (activityEntry) {
  existingJob.activity.push(activityEntry);
}

const updatedJob = await existingJob.save();

res.json(updatedJob);


    
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
