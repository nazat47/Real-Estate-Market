const { BadRequest, Unauthenticated, NotFound } = require("../errors");
const { attachCookies, createTokenUser } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const user = require("../models/user");
const verificationOtp = require("../models/otp");
const nodemailer = require("nodemailer");

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  // if(password.length<8){
  //   throw new BadRequest("Password must be more than 8 characters long")
  // }
  const newUser = await user.create({ username, email, password });
  const otp = generateOtp();
  const otpVerify = await verificationOtp.create({
    userid: newUser._id,
    otp: otp,
  });
  const transport = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "trace.bechtelar13@ethereal.email",
      pass: "Y7Pr8C7HThXNWcXrVB",
    },
  });
  const info = await transport.sendMail({
    from: "verification@gmail.com",
    to: email,
    subject: "Verify your email account",
    html: `<h1>${otp}</h1>`,
  });
  const tokenUser = createTokenUser(newUser);
  attachCookies(res, tokenUser);
  res.status(201).json(newUser);
};
const generateOtp = () => {
  let otp = "";
  for (let i = 0; i <= 3; i++) {
    let randVal = Math.round(Math.random() * 9);
    otp += randVal;
  }
  return otp;
};
const verifyEmail = async (req, res) => {
  const { userid, otp } = req.body;
  if (!userid || !otp) {
    throw new BadRequest("Please enter otp");
  }
  const verifyOtp = await verificationOtp.findOne({ userid: userid });
  if (!verifyOtp) {
    throw new NotFound("User id not found");
  }
  const isMatch = await verifyOtp.compareOtp(otp);
  if (!isMatch) {
    throw new BadRequest("Invalid code");
  }
  const userVerify = await user.findOneAndUpdate(
    { _id: userid },
    { verified: true },
    {
      new: true,
    }
  );
  await verificationOtp.findByIdAndDelete(verifyOtp._id);
  res.status(200).json({ success: "user verified" });
};
const signin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("Please provide your email and password");
  }
  const User = await user.findOne({ email });
  if (!User) {
    throw new Unauthenticated("No user is associated with this email");
  }
  const passMatched = await User.comparePassword(password);
  if (!passMatched) {
    throw new Unauthenticated("Password is not correct");
  }
  const tokenUser = createTokenUser(User);
  attachCookies(res, tokenUser);
  const { password: pass, ...rest } = User._doc;
  res.status(StatusCodes.OK).json(rest);
};
const googleAuth = async (req, res) => {
  const { name, email, image } = req.body;
  const User = await user.findOne({ email });
  if (!User) {
    const generatePassword = Math.random().toString(36).slice(-8);
    const newUser = await user.create({
      username: name.split(" ").join("").toLowerCase(),
      email: email,
      password: generatePassword,
      avatar: image,
    });
    console.log(newUser);
    const tokenUser = createTokenUser(newUser);
    attachCookies(res, tokenUser);
    const { password: pass, ...rest } = newUser._doc;
    res.status(200).json(rest);
  } else {
    console.log(User);
    const tokenUser = createTokenUser(User);
    attachCookies(res, tokenUser);
    const { password: pass, ...rest } = User._doc;
    res.status(200).json(rest);
  }
};
const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "user has been logged out" });
};
module.exports = { signup, signin, googleAuth, logout, verifyEmail };
