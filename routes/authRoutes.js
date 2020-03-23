const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL, //sender's MAIL
        pass: process.env.PASS //password
    }
});
const { User } = require("../models");
const isEmpty = require("../utils/isEmpty");
const {
    userAlreadyRegistered,
    passwordIncorrect,
    usernameNotFound,
    logoutError,
    logoutSuccess
} = require("../utils/constants");
const isLoggedInValidator = require("../validators/isLoggedInValidator");
const notLoggedInValidator = require("../validators/notLoggedInValidator");
const registerInputValidator = require("../validators/registerInputValidator");
const loginInputValidator = require("../validators/loginInputValidator");

const router = express.Router();

let rand, mailOptions, host, link;
// @route    POST: /auth/register
// @desc     Register the user
// @access   Public
router.post(
    "/register",
    isLoggedInValidator,
    registerInputValidator,
    async (req, res) => {
        const { name, username, email, password, type, mobile } = req.body;

        const exists = await User.findOne({ username });
        if (exists)
            return res
                .status(400)
                .json({ success: false, message: userAlreadyRegistered });
        let newUser = new User({
            name,
            username,
            email,
            type,
            mobile
        });
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_LENGTH));
        const hash = await bcrypt.hash(password, salt);
        newUser.password = hash;
        newUser = await newUser.save();
        req.session.userId = newUser._id;
        const payload = {
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            mobile: newUser.mobile,
            type: newUser.type,
            emailVerified: false
        };
        //////////////////////=====================================================
        //sending email to user

        rand = Math.floor(Math.random() * 1000 + 54);
        host = req.get("host");
        link =
            "http://" +
            req.get("host") +
            "/auth/verify?id=" +
            rand +
            "&user=" +
            newUser._id;
        mailOptions = {
            to: req.body.email,
            subject: "Please confirm your Email account",
            html:
                "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
                link +
                ">Click here to verify</a>"
        };
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response) {
            if (error) {
                console.log(error);
                // res.end("error");
            } else {
                console.log("Message sent: " + response.message);
                // res.end("Email has been sent.");
            }
        });
        //////////////////////=======================================================
        res.json(payload);
    }
);

router.get("/verify", async (req, res) => {
    console.log(req.protocol + "://" + req.get("host"));
    if (req.protocol + "://" + req.get("host") == "http://" + host) {
        const userid = req.query.user;
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            const user = await User.findByIdAndUpdate(
                { _id: userid },
                { emailVerified: true }
            ).lean();
            if (!user)
                return res
                    .status(404)
                    .json({ success: false, message: usernameNotFound });
            req.session.userId = user._id;
            const payload = {
                _id: user._id,
                name: user.name,
                username: user.username,
                mobile: user.mobile,
                type: user.type,
                emailVerified: true
            };
            res.json(payload);
        } else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    } else {
        res.end("<h1>Request is from unknown source</h1>");
    }
});

// @route    POST: /auth/login
// @desc     Login user
// @access   Public

router.post(
    "/login",
    isLoggedInValidator,
    loginInputValidator,
    async (req, res) => {
        const { username, password } = req.body;
        const user = await User.findOne({ username }).lean();
        if (!user)
            return res
                .status(404)
                .json({ success: false, message: usernameNotFound });
        const matched = await bcrypt.compare(password, user.password);
        if (!matched)
            return res
                .status(400)
                .json({ success: false, message: passwordIncorrect });

        req.session.userId = user._id;
        const payload = {
            _id: user._id,
            name: user.name,
            username: user.username,
            mobile: user.mobile,
            type: user.type
        };
        res.json(payload);
    }
);

// @route    POST: /auth/logout
// @desc     Logout user
// @access   Public

router.get("/logout", notLoggedInValidator, (req, res) => {
    req.session.destroy(err => {
        if (err)
            return res
                .status(400)
                .json({ success: false, message: logoutError });

        res.clearCookie(process.env.SESS_NAME);
        res.json({ success: true, message: logoutSuccess });
    });
});

module.exports = router;
