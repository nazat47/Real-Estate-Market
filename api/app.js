require("express-async-errors");
require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const errorHandler = require("./middlewares/error-handler");
const notFound = require("./middlewares/notFound");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const listingRoute = require("./routes/listing");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());
app.use(helmet());
app.use(xss());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/listing", listingRoute);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listeing on port ${port}`));
  } catch (error) {
    console.log(error.message);
  }
};
start();
