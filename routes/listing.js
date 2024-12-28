const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , ValidateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(listingController.Index))
.post(isLoggedIn , upload.single('listing[image]'), ValidateListing , wrapAsync(listingController.createListing));


//New Route
router.get("/new", isLoggedIn, listingController.renderNewform);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn , isOwner , upload.single('listing[image]'), ValidateListing , wrapAsync(listingController.updateListing))
.delete(isLoggedIn , isOwner ,  wrapAsync(listingController.deleteListing));

//Edit Route
router.get("/:id/edit", isLoggedIn ,   isOwner ,  wrapAsync(listingController.renderEditform));


module.exports = router;