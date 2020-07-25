const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const session = require("express-session");
const cors = require("cors");
const MongoStore = require("connect-mongo")(session);
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const slotsRoutes = require("./routes/slotsRoutes");
const expertRoutes = require("./routes/expertRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const notLoggedInValidator = require("./validators/notLoggedInValidator");
const setUser = require("./utils/setUser");

const Razorpay = require("razorpay");
new Razorpay({
  key_id: "rzp_test_4JLpoFGA17xkZq",
  key_secret: "89CUTDzmDYbIYqgpUabjGtav",
});

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8001;

const devCorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(devCorsOptions));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    name: process.env.SESS_NAME,
    secret: process.env.SESS_SECRET,
    store: new MongoStore({
      url: process.env.MONGO_URI,
    }),
    saveUninitialized: false,
    resave: false,
  })
);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/payment", paymentRoutes);
app.use(notLoggedInValidator);
app.use(setUser);
app.get("/auth/user", (req, res) => res.json(req.user));
app.use("/slots", slotsRoutes);
app.use("/expert", expertRoutes);
app.listen(port, () => console.log(`Server Online on port ${port}...`));
