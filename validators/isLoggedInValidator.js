const isLoggedInValidator = (req, res, next) => ((req.session.userId) ? res.status(400).json({ login: 'Already Logged In!' }) : next());
module.exports = isLoggedInValidator;
