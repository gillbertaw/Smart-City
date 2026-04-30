const express = require("express");
const router = express.Router();
const floodController = require("../controllers/floodReportController");
const { authenticate, isAdmin } = require("../middleware/auth");

router.get("/", floodController.getAll);
router.get("/kecamatan/:kecamatan", floodController.getByKecamatan);
router.post("/", authenticate, floodController.create);

router.put("/:id/status", authenticate, isAdmin, floodController.updateStatus);
router.delete("/:id", authenticate, isAdmin, floodController.remove);

module.exports = router;
