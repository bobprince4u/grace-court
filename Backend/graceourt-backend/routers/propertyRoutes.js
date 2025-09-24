const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const propertyController = require("../controllers/propertyController");

router.get("/search", propertyController.searchProperties);

router.post(
  "/",
  upload.array("propertyImage", 15),
  propertyController.createProperty
);

router.put(
  "/:id",
  upload.array("propertyImage", 10),
  propertyController.updateProperty
);
router.patch(
  "/:id",
  upload.array("propertyImage", 10),
  propertyController.patchProperty
);

router.get("/", propertyController.getAllProperties);
router.get("/:id", propertyController.getPropertyById);
router.delete("/:id", propertyController.deleteProperty);

module.exports = router;
