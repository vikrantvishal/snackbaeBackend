const express = require("express");
const router = express.Router();

const galleryController = require("../Controllers/gallery");



// Set up multer storage for file uploads to DigitalOcean Spaces
// Route for uploading images to the gallery
router.post("/gallery", galleryController.uploadImages);

// Route for retrieving all images from the gallery
router.get("/gallery", galleryController.getAllImages);

module.exports = router;
