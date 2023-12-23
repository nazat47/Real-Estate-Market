const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authentication");
const {
  deleteUser,
  updateUser,
  getUserListing,
  getUser,
  sendMail,
} = require("../controllers/user");
const { verifyEmail } = require("../controllers/auth");

router.patch("/updateuser/:id", authenticateUser, updateUser);
router.delete("/deleteuser/:id", authenticateUser, deleteUser);
router.get("/listing/:id", authenticateUser, getUserListing);
router.get("/:id", getUser);
router.post("/email", sendMail);
router.post("/email/verify", verifyEmail);
module.exports = router;
