const notLoggedInValidator = (req, res, next) => ((!req.session.userId) ? res.status(400).json({ login: 'Not Logged In!' }) : next());
module.exports = notLoggedInValidator;
