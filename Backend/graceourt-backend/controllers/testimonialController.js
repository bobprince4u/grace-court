const Testimonial = require("../models/testimonialModel");
const { uploadToS3 } = require("../utils/s3");

// Create a new testimonial (admin or guest)
exports.createTestimonial = async (req, res) => {
  try {
    const { name, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Name and message are required.",
      });
    }

    // Validate message length (schema will also enforce)
    if (message.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 20 characters long.",
      });
    }

    // Handle image upload
    let imageUrl = null;
    if (req.file) {
      try {
        imageUrl = await uploadToS3(req.file);
      } catch (uploadErr) {
        console.error("S3 upload error:", uploadErr);
        return res.status(500).json({
          success: false,
          message: "Failed to upload image",
          error: uploadErr.message,
        });
      }
    }

    // Create testimonial in DB
    const testimonial = new Testimonial({
      name,
      message,
      image: imageUrl || null,
      approved: false, // admin will approve later
      hidden: false,
    });

    const saved = await testimonial.save();

    return res.status(201).json({
      success: true,
      message: "Testimonial created successfully.",
      testimonial: saved,
    });
  } catch (error) {
    console.error("Create Testimonial Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

// GET all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      testimonials: testimonials.map((t) => ({
        _id: t._id,
        name: t.name,
        message: t.message,
        image: t.image || null, // <-- image included
        approved: t.approved,
        hidden: t.hidden,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get Testimonials Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch testimonials",
      error: error.message,
    });
  }
};

/**
 * Approve a testimonial
 */
exports.approveTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      { approved: true, hidden: false },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial approved successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Approve Testimonial Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error approving testimonial",
      error: error.message,
    });
  }
};

/**
 * Delete a testimonial
 */
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Delete Testimonial Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting testimonial",
      error: error.message,
    });
  }
};
