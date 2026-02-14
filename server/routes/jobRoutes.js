const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const jobController = require("../controller/jobController");

/*
  Validate MongoDB ObjectId
*/
router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }
  next();
});

/*
  Routes
*/

// GET /api/jobs  → list (with filters)
// POST /api/jobs → create
router
  .route("/")
  .get(jobController.getJobs)
  .post(jobController.createJob);

// PATCH /api/jobs/:id → partial update
// DELETE /api/jobs/:id → delete
router
  .route("/:id")
  .patch(jobController.updateJob)
  .delete(jobController.deleteJob);

module.exports = router;
