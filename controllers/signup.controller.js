const User = require("../models/user.model");
const { authenticateUser } = require("../helper");
const { APP_ROUTES, FLASH_MESSAGE_TYPES } = require("../constants");
const { SUCCESS, ERROR } = FLASH_MESSAGE_TYPES;
const { SIGN_UP } = APP_ROUTES;

const getSignUpController = (req, res) => {
  res.render("signup", { title: "Sign Up" });
};

const postSignUpController = async (req, res, next) => {
  let user; // user object

  // check if username & password is empty. if empty, return error message.
  if (req.body.username === "" || req.body.password === "") {
    req.flash(ERROR, "Username or password is empty.");
    return res.redirect(SIGN_UP);
  }

  // check if passwords match
  if (req.body.password !== req.body.password2) {
    res.render("signup", { title: "Sign Up", error: "Passwords do not match" });
  }

  try {
    // check if user already exists
    user = await User.findOne({ username: req.body.username });
    if (user) {
      req.flash(ERROR, "User already exists.");
      res.redirect(SIGN_UP);
    } else {
      user = new User(req.body); // create new user object
      await user.save(); // save user to database
      req.flash(SUCCESS, "You have successfully signed up.");
      // authenticate user and redirect to home page
      authenticateUser(true)(req, res, next);
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSignUpController,
  postSignUpController,
};
