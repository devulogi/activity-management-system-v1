const express = require("express");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");

const flash = require("connect-flash");
require("dotenv").config();

const app = express();
const routes = require("./routes");
const passportService = require("./services/passport.service");
const dbConnect = require("./services/mongoose");

// set up pug for templating
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(morgan("dev")); // log every request to the console
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET, // used to sign the session ID cookie
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    cookie: {
      maxAge: 86400000, // maxAge is in milliseconds (24 hours)
    },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
  })
);
app.use(
  passport.initialize({
    userProperty: "user", // default is 'user'
  })
); // initialize passport
app.use(
  passport.session({
    pauseStream: true, // pause the stream when the session is being destroyed
  })
); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
passportService(); // configure passport strategies and serialize/deserialize user

// Routes
app.use(routes);

// Start server
app.listen(process.env.EXPRESS_APP_PORT, () => {
  console.log("Server started on port 3000");
  // connect to database
  dbConnect();
});
