const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, ValidateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.Index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    ValidateListing,
    wrapAsync(listingController.createListing)
  );

//New Route
router.get("/new", isLoggedIn, listingController.renderNewform);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    ValidateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditform)
);

// Icon वर क्लिक केल्यावर संबंधित लिस्टिंग
router.get("/category/:category", async (req, res) => {
  try {
    const listings = await Listing.find({ category: req.params.category });
    res.json(listings); // JSON स्वरूपात Data फ्रंटएंडला पाठवा
  } catch (err) {
    res.status(500).json({ error: "डाटा आणण्यात समस्या आली आहे!" });
  }
});

// Search Query साठी API
router.get("/search", async (req, res) => {
    const query = req.query.q; // 'q' म्हणजे Search Query
    try {
        const listings = await Listing.find({
            title: { $regex: query, $options: "i" }, // Regex वापरून Search करा
        });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: "सर्च करताना समस्या आली!" });
    }
});


module.exports = router;
