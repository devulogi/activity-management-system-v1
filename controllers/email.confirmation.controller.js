const Token = require("../models/token.model");
const User = require("../models/user.model");
const { APP_ROUTES, FLASH_MESSAGE_TYPES } = require("../constants");
const { LOGIN } = APP_ROUTES;
const { SUCCESS, INFO, ERROR } = FLASH_MESSAGE_TYPES;

// require("./confirmation.route") - // GET /confirmation/:token - Confirmation page
/**
 * @param {Object} req - request object from client
 * @param {Object} res - response object from server
 * @param {Function | null} next - next middleware function
 */
const emailConfirmationController = async (req, res, next) => {
  try {
    const token = await Token.findOne({ token: req.params.token });
    if (!token) {
      req.flash(
        ERROR,
        "We were unable to find a valid token. Your token may have expired."
      );
      return res.redirect(LOGIN);
    }
    let user = await User.findOne({ _id: token._userId });
    // if user is not found in database then redirect to login page
    if (!user) {
      req.flash(ERROR, "We were unable to find a user for this token.");
      return res.redirect(LOGIN);
    }
    // if user is found in database then check if user is already verified
    if (user.isVerified) {
      req.flash(INFO, "This account has already been verified. Please log in.");
      return res.redirect(LOGIN);
    } else {
      // if user is not verified then verify user and redirect to login page
      await User.findOneAndUpdate({ _id: user._id }, { isVerified: true });
      req.flash(SUCCESS, "The account has been verified. Please log in.");
      res.redirect("http://localhost:3000/login");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = emailConfirmationController;
