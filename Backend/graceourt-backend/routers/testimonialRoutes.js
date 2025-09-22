const express = require("express");
const router = express.Router();
const multer = require("multer");
const testimonialController = require("../controllers/testimonialController");

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/testimonials
router.post(
  "/",
  upload.single("image"),
  testimonialController.createTestimonial
);

router.get("/", testimonialController.getTestimonials);

router.patch("/:id/approve", testimonialController.approveTestimonial);

router.delete("/:id", testimonialController.deleteTestimonial);

module.exports = router;
