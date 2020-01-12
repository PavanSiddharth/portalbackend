const validator = require('validator');
const isEmpty = require('../utils/isEmpty');

module.exports = (req, res, next) => {
    const data = req.body;
    const errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (validator.isEmpty(data.username)) {
        errors.username = 'Username is required!';
    }

    if (!validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be between 6 to 30 characters!';
    }

    if (validator.isEmpty(data.password)) {
        errors.password = 'Password field is required!';
    }

    if (!isEmpty(errors)) return res.status(400).json({ user: errors });

    next();
};
