const { StatusCodes } = require("http-status-codes");
const { Unauthenticated, BadRequest, NotFound } = require("../errors");
const user = require("../models/user");
const { createTokenUser, attachCookies, checkPermission } = require("../utils");
const listing = require("../models/listing");
const nodemailer = require("nodemailer");

const updateUser = async (req, res) => {
  const {
    params: { id },
    user: { id: userid },
    body: { username, email, password, avatar },
  } = req;
  if (id !== userid) {
    throw new Unathorized("No user found with this id");
  }
  if (username === "" || email === "") {
    throw new BadRequest("Your name and email can not be empty");
  }
  if (password) {
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
  }
  const updateuser = await user.findByIdAndUpdate(
    id,
    {
      $set: {
        username,
        email,
        password,
        avatar,
      },
    },
    { new: true }
  );
  const tokenUser = createTokenUser(updateuser);
  attachCookies(res, tokenUser);
  const { password: pass, ...rest } = updateuser._doc;
  res.status(StatusCodes.OK).json(rest);
};
const deleteUser = async (req, res) => {
  if (req.params.id !== req.user.id) {
    throw new Unathorized("Can not delete account");
  }
  await user.findByIdAndDelete(req.params.id);
  res.clearCookie("token");
  res.status(200).json({ message: "user deleted" });
};
const getUserListing = async (req, res) => {
  checkPermission(req.user, req.params.id);
  const listings = await listing.find({ userRef: req.params.id });
  res.status(StatusCodes.OK).json(listings);
};
const getUser = async (req, res) => {
  const User = await user.findOne({ _id: req.params.id }).select("-password");
  if (!User) {
    throw new NotFound(`No user found with id ${req.params.id}`);
  }
  res.status(200).json(User);
};
const sendMail = async (req, res) => {
  console.log(process.env.USER);
  const transport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "giovani7@ethereal.email",
      pass: "ba9zkMvugEKevzzfRH",
    },
  });
  const info = await transport.sendMail({
    to: "nazat.mf@gmail.com",
    subject: `About listing, from -${req.body.from}`,
    text: req.body.message,
  });
  res.status(200).json({ msg: "email sent" });
};
module.exports = { updateUser, deleteUser, getUserListing, getUser, sendMail };
