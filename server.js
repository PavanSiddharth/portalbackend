const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 3001;

const notLoggedInValidator = require('./validators/notLoggedInValidator');
const setUser = require('./utils/setUser');

app.set("view engine","ejs");
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
    }),
);


app.use('/auth', authRoutes);

app.listen(port, () => console.log(`Server Online on port ${port}...`));
