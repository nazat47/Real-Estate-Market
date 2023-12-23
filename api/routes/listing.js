const express = require("express");
const authenticateUser = require("../middlewares/authentication");
const {
  createListing,
  deleteListing,
  getListing,
  updateListing,
  getListings,
} = require("../controllers/listing");

const router = express.Router();

router.post("/create", authenticateUser, createListing);
router.get("/:id", getListing);
router.get("/get/all", getListings);
router.delete("/:id", authenticateUser, deleteListing);
router.patch("/:id", authenticateUser, updateListing);
module.exports = router;
