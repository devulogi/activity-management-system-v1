const express = require("express");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { connect: db, connection } = require("mongoose").default;
const flash = require("connect-flash");

const app = express();
const routes = require("./routes");
const User = require("./models/user.model");

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
    secret: "a2V5Ym9hcmQgY2F0", // used to sign the session ID cookie
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
passport.serializeUser(function (user, cb) {
  cb(null, user._id);
}); // store the user id in the session555
passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user); // return the user object
  });
}); // retrieve the user object from the session
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        // if user is not found
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        } else {
          // compare passwords
          user.comparePassword(password, (err, isMatch) => {
            if (err) {
              return done(err);
            } else if (!isMatch) {
              return done(null, false, { message: "Incorrect password." });
            } else {
              return done(null, user);
            }
          });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Routes
app.use(routes);

// Start server
app.listen(3000, () => {
  console.log("Server started on port 3000");
  // Connect to database
  db("mongodb://localhost:27017/express-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 1000,
  });
  connection.on("error", function () {
    console.error("connection error:");
    process.exit(1); // exit gracefully on error
  });
  connection.once("open", function () {
    // we're connected!
    console.log("Connected to database");
  });
});
