//sudo netstat -lpn |grep :8080
//kill number
const path = require("path");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const rateLimit = require("express-rate-limit");

const passportJWT = require('./middlewares/passportJWT')();
const errorHandler = require("./middlewares/errorHandler");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const followRoutes = require('./routes/follow');

const { Mongoose } = require("mongoose");
const { config } = require("process");

const app = express();

app.use(cors());

//app.set('trust proxy', 1); 
const limiter = rateLimit({
    windowMs: 15 * 1000, // 15 minutes
    max: 10 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/instaclone-node', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(passportJWT.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/post", passportJWT.authenticate(), postRoutes);
app.use("/api/follow", passportJWT.authenticate(), followRoutes);
app.use(errorHandler);

app.listen(8000, () => {
    console.log("Listening");
});