const passport = require("passport");
const User = require("../models/user.model");
const { Strategy: LocalStrategy } = require("passport-local");

const passportService = () => {
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
};

module.exports = passportService;
