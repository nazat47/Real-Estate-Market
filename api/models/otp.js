const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const verificationSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
});

verificationSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.otp = await bcrypt.hash(this.otp, salt);
});
verificationSchema.methods.compareOtp = async function (canditateOtp) {
  const isMatch = await bcrypt.compare(canditateOtp, this.otp);
  return isMatch;
};
module.exports = mongoose.model("Verification", verificationSchema);
