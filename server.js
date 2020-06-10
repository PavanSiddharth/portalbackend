const express = require('express');
const bodyParser = require('body-parser');
const http = require('http')
const session = require('express-session');
const cors = require('cors');
const MongoStore = require('connect-mongo')(session);
const socketio = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const slotsRoutes = require('./routes/slotsRoutes');
const expertRoutes = require('./routes/expertRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 8001;

const devCorsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

const notLoggedInValidator = require('./validators/notLoggedInValidator');
const setUser = require('./utils/setUser');

app.use(cors(devCorsOptions));
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
app.use(notLoggedInValidator);
app.use(setUser);
app.get('/auth/user', (req, res) => res.json(req.user));
app.use('/slots', slotsRoutes);
app.use('/expert', expertRoutes);
app.use('/chats', chatRoutes);
app.listen(port, () => console.log(`Server Online on port ${port}...`));
