const mongoose = require('mongoose');
require('dotenv').config();

const {
    mongooseConnectionSuccess,
    mongooseConnectionInterrupt,
} = require('../utils/constants');

mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.log(mongooseConnectionSuccess))
    .catch((err) => console.error(err));

// mongoose.set('useFindAndModify', false);
// mongoose.set('useCreateIndex', true);

mongoose.connection.on('disconnected', () => {
    console.log(mongooseConnectionInterrupt);
});

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected');
        process.exit(0);
    });
});

module.exports.User = require('./userModel');
module.exports.Slot = require('./slotModel');
module.exports.Chat = require('./chatModel');
module.exports.Expert = require('./expertModel');