const Job = require("../model/Job");

/*
  CREATE JOB
*/
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);

    return res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  GET JOBS (Filter + Search + Sort)
*/
exports.getJobs = async (req, res) => {
  try {
    const { status, priority, search, sort } = req.query;

    const filter = {};

    // Filter by status
    if (status && status !== "all") {
      filter.status = status;
    }

    // Filter by priority
    if (priority && priority !== "all") {
      filter.priority = priority;
    }

    // Search company or role
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    // Default sort
    const sortOption = sort || "-createdAt";

    const jobs = await Job.find(filter).sort(sortOption);

    return res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  UPDATE JOB
*/
exports.updateJob = async (req, res) => {
  try {
    const allowedFields = [
      "company",
      "role",
      "status",
      "priority",
      "location",
      "ctc",
      "source",
      "referred",
      "resume",
      "jobUrl",
      "notes",
      "appliedDate",
      "followUpDate",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
  DELETE JOB
*/
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
