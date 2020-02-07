const isEmpty = require('./isEmpty');
const { User } = require('../models');
//= =========================================================================
const setUser = async (req, res, next) => {
    const { userId } = req.session;
    if (!isEmpty(userId)) {
        const user = await User.findById(userId)
            .lean()
            .catch(() => {});
        const payload = {
            _id: user._id,
            access: user.access,
            name: user.name,
            username: user.username,
            mobile: user.mobile,
            type: user.type,
            location: user.location,
        };
        req.user = payload;
    }
    next();
};
//= =========================================================================
module.exports = setUser;
