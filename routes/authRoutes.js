const express = require('express');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const { User } = require('../models');
const isEmpty = require('../utils/isEmpty');
const {
    userAlreadyRegistered,
    passwordIncorrect,
    usernameNotFound,
    logoutError,
    logoutSuccess,
} = require('../utils/constants');
const isLoggedInValidator = require('../validators/isLoggedInValidator');
const notLoggedInValidator = require('../validators/notLoggedInValidator');
const registerInputValidator = require('../validators/registerInputValidator');
const loginInputValidator = require('../validators/loginInputValidator');

const router = express.Router();

// @route    GET: /auth/signup
// @desc     Signup page
// @access   Public
router.get('/signup', isLoggedInValidator, (req, res) => {
    res.render('auth/register')
})

// @route    POST: /auth/register
// @desc     Register the user
// @access   Public
router.post('/register', isLoggedInValidator, registerInputValidator, async (req, res) => {
    const {
        name, username, email, password, type, mobile,
    } = req.body;

    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ success: false, message: userAlreadyRegistered });
    let newUser = new User({
        name, username, email, type, mobile,
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
    };
    res.json(payload);
});

// @route    GET: /auth/login
// @desc     Login page
// @access   Public

router.get('/login', isLoggedInValidator, (req, res) => {
    res.render('auth/login');
})

// @route    POST: /auth/login
// @desc     Login user
// @access   Public

router.post('/login', isLoggedInValidator, loginInputValidator, async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();
    if (!user) return res.status(404).json({ success: false, message: usernameNotFound });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(400).json({ success: false, message: passwordIncorrect });

    req.session.userId = user._id;
    const payload = {
        _id: user._id,
        name: user.name,
        username: user.username,
        mobile: user.mobile,
        type: user.type,
    };
    res.json(payload);
});

// @route    POST: /auth/logout
// @desc     Logout user
// @access   Public

router.get('/logout', notLoggedInValidator, (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ success: false, message: logoutError });

        res.clearCookie(process.env.SESS_NAME);
        res.json({ success: true, message: logoutSuccess });
    });
});

module.exports = router;