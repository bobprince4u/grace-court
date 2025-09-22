const mongoose = require("mongoose");
const Property = require("../models/propertiesModel");
const Booking = require("../models/bookingsModel");
const { uploadToS3 } = require("../utils/s3");

exports.createProperty = async (req, res) => {
  try {
    const { name, location, rooms, amenities, description } = req.body;

    // 1. Validate required fields
    if (!name || !location || !rooms) {
      return res.status(400).json({
        success: false,
        message: "Required fields (name, location, rooms) are missing.",
      });
    }

    // 2. Handle image uploads (if any)
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      console.log(
        "Files received:",
        req.files.map((f) => f.originalname)
      ); // Debugging
      const uploadPromises = req.files.map((file) => uploadToS3(file));
      const uploadResults = await Promise.all(uploadPromises);

      imageUrls = uploadResults.map((result) => {
        if (typeof result === "string") return result;
        if (result.Location) return result.Location;
        if (result.url) return result.url; // Custom return
        return `https://${process.env.AWS_S3_BUCKET}.s3.${
          process.env.AWS_REGION
        }.amazonaws.com/${result.Key || result.key}`;
      });
    }

    // 3. Normalize amenities field
    const normalizedAmenities = Array.isArray(amenities)
      ? amenities
      : amenities
      ? amenities.split(",").map((a) => a.trim())
      : [];

    // 4. Create property in DB
    const newProperty = new Property({
      name,
      location,
      rooms: Number(rooms),
      amenities: normalizedAmenities,
      description: description,
      propertyImage: imageUrls,
    });

    const savedProperty = await newProperty.save();

    // 5. Send response
    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      property: savedProperty,
    });
  } catch (error) {
    console.error("Create Property Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//GET all properties
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find(
      {},
      "name location rooms propertyImage status"
    );

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error("Get All Properties Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("=== GET PROPERTY BY ID DEBUG ===");
    console.log("Requested ID:", id);

    // ✅ Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ObjectId format");
      return res.status(404).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(id);

    console.log("Property found:", !!property);
    if (property) {
      console.log("Property name:", property.name);
      console.log("Property description:", property.description);
      console.log("Description length:", property.description?.length || 0);
      console.log("Description type:", typeof property.description);
      console.log("Full property object:", JSON.stringify(property, null, 2));
    }

    if (!property) {
      console.log("No property found with ID:", id);
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error("Get Property By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//Update a property by ID
exports.updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, rooms, amenities, description, status } = req.body;

    console.log("=== UPDATE PROPERTY DEBUG ===");
    console.log("Property ID:", id);
    console.log("Request body:", req.body);
    console.log("Description field:", description);
    console.log("Description length:", description?.length || 0);

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    // Find existing property
    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Handle image uploads if any
    let imageUrls = existingProperty.propertyImage || [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadToS3(file));
      const uploadResults = await Promise.all(uploadPromises);

      imageUrls = uploadResults.map((result) => {
        if (typeof result === "string") return result;
        if (result.Location) return result.Location;
        if (result.url) return result.url;
        return `https://${process.env.AWS_S3_BUCKET}.s3.${
          process.env.AWS_REGION
        }.amazonaws.com/${result.Key || result.key}`;
      });
    }

    // Normalize amenities
    const normalizedAmenities = Array.isArray(amenities)
      ? amenities
      : amenities
      ? amenities.split(",").map((a) => a.trim())
      : existingProperty.amenities;

    // Prepare update data - only include fields that should be updated
    const updateData = {
      name: name || existingProperty.name,
      location: location || existingProperty.location,
      rooms: rooms ? Number(rooms) : existingProperty.rooms,
      amenities: normalizedAmenities,
      status: status || existingProperty.status,
      propertyImage: imageUrls,
    };

    // Only update description if it's provided and not empty
    if (description !== undefined && description !== null) {
      updateData.description = description.trim();
    }

    console.log("Update data:", updateData);

    // Update the property
    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
      new: true, // Return updated document
      runValidators: true, // Run schema validations
    });

    console.log("Updated property:", updatedProperty);

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Update Property Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

//Patch a property
exports.patchProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    // Find the existing property
    const existingProperty = await Property.findById(id);
    if (!existingProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Apply only provided fields
    const updateData = {};

    // Standard fields
    ["name", "location", "rooms", "description", "status"].forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Amenities
    if (req.body.amenities !== undefined) {
      updateData.amenities = Array.isArray(req.body.amenities)
        ? req.body.amenities
        : req.body.amenities.split(",").map((a) => a.trim());
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) => uploadToS3(file));
      const uploadResults = await Promise.all(uploadPromises);
      updateData.propertyImage = uploadResults.map(
        (result) => result.Location || result.url || result
      );
    }

    // Update document
    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Property partially updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Patch Property Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid property ID" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Optional cleanup: remove images from S3
    if (property.propertyImage && property.propertyImage.length > 0) {
      try {
        await deleteFromS3(property.propertyImage);
      } catch (s3Err) {
        console.error("S3 cleanup failed:", s3Err);
      }
    }

    await property.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully",
      deletedProperty: property,
    });
  } catch (error) {
    console.error("Delete Property Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.uploadPropertyImages = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid property ID" });
    }

    const property = await Property.findById(id);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images uploaded" });
    }

    // Upload each file to S3
    const uploadPromises = req.files.map((file) => uploadToS3(file));
    const uploadedUrls = await Promise.all(uploadPromises);

    // Merge with existing images
    property.propertyImage = [...property.propertyImage, ...uploadedUrls];
    const updated = await property.save();

    return res.status(200).json({
      success: true,
      message: "Images uploaded and attached successfully",
      property: updated,
    });
  } catch (error) {
    console.error("Upload Property Images Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Search available properties
exports.searchProperties = async (req, res) => {
  try {
    const { location, checkIn, checkOut, guests } = req.query;

    if (!location || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        success: false,
        message: "Location, check-in, check-out, and guests are required.",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Check-out must be after check-in date.",
      });
    }

    // Step 1: Find properties in the location that meet guest capacity
    const properties = await Property.find({
      location: { $regex: new RegExp(location, "i") },
      status: "active",
      rooms: { $gte: guests },
    });

    if (!properties.length) {
      return res.status(200).json({
        success: true,
        properties: [],
        message: `No available properties found in ${location}.`,
      });
    }

    // Step 2: Exclude properties with overlapping bookings
    const availableProperties = [];
    for (let property of properties) {
      const overlappingBooking = await Booking.findOne({
        property: property._id,
        $or: [
          {
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate },
          },
        ],
        status: { $in: ["pending", "confirmed"] },
      });

      if (!overlappingBooking) {
        availableProperties.push(property);
      }
    }

    return res.status(200).json({
      success: true,
      count: availableProperties.length,
      properties: availableProperties,
      message:
        availableProperties.length > 0
          ? `${availableProperties.length} properties found in ${location}`
          : `No available properties found in ${location}`,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
