const validator = require('validator');
const isEmpty = require('../utils/isEmpty');
require('dotenv').config();

module.exports = (req, res, next) => {
    const data = req.body;
    const errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    data.mobile = !isEmpty(data.mobile) ? data.mobile : '';

    // if (!isEmpty(data.access) && data.access !== process.env.ADMIN_ACCESS_STRING) {
    //     errors.access = 'Invalid specifier!';
    // }

    if (!validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = 'Name must be between 2 to 30 characters!';
    }

    if (validator.isEmpty(data.name)) {
        errors.name = 'Name field is required!';
    }

    if (!validator.isEmail(data.email)) {
        errors.email = 'Email is invalid!';
    }

    if (validator.isEmpty(data.email)) {
        errors.email = 'Email field is required!';
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be between 6 to 30 characters!';
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required!';
    }

    if (!validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match!';
    }

    if (validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password field is required!';
    }

    if (!validator.isMobilePhone(data.mobile)) {
        errors.mobile = 'Please specify a valid mobile number!';
    }

    if (validator.isEmpty(data.mobile)) {
        errors.mobile = 'Please specify a mobile number!';
    }

    if (!isEmpty(errors)) return res.status(400).json(errors);

    next();
};
