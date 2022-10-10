const crypto = require("crypto");
const User = require("../models/user.model");
const Token = require("../models/token.model");
const { authenticateUser, sendVerificationEmail } = require("../helper");
const { APP_ROUTES, FLASH_MESSAGE_TYPES } = require("../constants");
const { ERROR } = FLASH_MESSAGE_TYPES;
const { SIGN_UP } = APP_ROUTES;

const getSignUpController = (req, res) => {
  res.render("signup", { title: "Sign Up", path: SIGN_UP });
};

const postSignUpController = async (req, res, next) => {
  let user, email, token; // placeholder for user, email, token

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
    // check if email already exists
    email = await User.findOne({ email: req.body.email });
    if (email) {
      req.flash(
        ERROR,
        "There is already an account associated with this email."
      );
      return res.redirect(SIGN_UP);
    }

    // check if user already exists
    user = await User.findOne({ username: req.body.username });
    if (user) {
      req.flash(
        ERROR,
        "There is already an account associated with this username."
      );
      res.redirect(SIGN_UP);
    } else {
      // create new user object
      user = new User(req.body);
      // create a token for user verification if user does not exist
      token = new Token({
        _userId: user._id,
        token: crypto.randomBytes(16).toString("hex"),
      });
      // save token to database
      await token.save();
      // send verification email to user
      await sendVerificationEmail(user, token)(req, res, next);
      // save user to database
      await user.save();
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
