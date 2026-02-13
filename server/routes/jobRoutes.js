const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controller/jobController");

// Validate MongoDB ID
router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
});

// Routes
router.route("/")
  .get(getJobs)
  .post(createJob);

router.route("/:id")
  .get(getJobById)
  .put(updateJob)
  .delete(deleteJob);

module.exports = router;
