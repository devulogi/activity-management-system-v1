const passport = require("passport");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const { APP_ROUTES, FLASH_MESSAGE_TYPES, ROLES } = require("./constants");
const { HOME, LOGIN } = APP_ROUTES;
const { SUCCESS, INFO, ERROR } = FLASH_MESSAGE_TYPES;
const { ADMIN, PARTICIPANT, USER } = ROLES;

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);
oAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

/**
 * Send email using nodemailer and googleapis to send email using OAuth2 authentication
 * @param user - user object containing email and name of user
 * @param token - token to be sent to user in email body to verify user
 * @return {(function(*, *, *): Promise<void>)|*}
 */
const sendVerificationEmail = (user, token) => {
  /**
   * Send verification email to user after registration is successful and user is created in the database
   * @param {Object} user - user object
   * @param {string} token - token to be sent to user in the verification email
   * @return {void}
   */
  return async (req, res, next) => {
    // get access token for nodemailer to send email using google oauth2
    const accessToken = await oAuth2Client.getAccessToken();
    // create a transporter object using the default SMTP transport and set the host, port, secure, auth, and tls options
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    // set the from, to, subject, and text options for the email
    const mailOptions = {
      from: process.env.EMAIL,
      to: req.body.email,
      subject: "Account Verification Token",
      text: `Hello ${req.body.username}, \n\n Please verify your account by clicking the link: \nhttp://${req.headers.host}/confirmation/${token.token}.\n`,
    };
    // send email to user with token link to verify account
    await transporter.sendMail(mailOptions);
  };
};

/**
 * Authenticate user and redirect to home page if user is authenticated or redirect to login page if user is not authenticated
 * @param {boolean} isNewUser
 * @return {(function(*, *, *): void)|*}
 */
const authenticateUser = (isNewUser = false) => {
  /**
   * POST /login - Authenticate user
   * Sign in using email and password.
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @return {Function | void}
   */
  return function (req, res, next) {
    // callback function to be called after passport authentication is done
    // @param {Object} err - error object if any
    // @param {Object | boolean} user - user object if authentication is successful or false if authentication is not successful
    // @param {Object} info - info object if any (usually contains error message) or empty object if authentication is successful
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err); // will generate a 500 error (Internal Server Error)
      }
      if (!user) {
        req.flash(ERROR, info.message); // will generate a 401 error (Unauthorized)
        return res.redirect(LOGIN); // redirect back to login page if user not found or password is incorrect
      } else if (isNewUser) {
        req.flash(
          SUCCESS,
          `A verification email has been sent to ${req.body.email}.`
        );
        res.redirect(LOGIN);
      } else if (!user._doc.isVerified) {
        // check if user is verified
        req.flash(ERROR, "Please verify your email address first.");
        return res.redirect(LOGIN);
      } else {
        req.logIn(user, (err) => {
          if (err) {
            return next(err); // will generate a 500 error (Internal Server Error)
          } else {
            req.flash(INFO, "You have successfully logged in.");
          }
          return res.redirect(HOME); // redirect to home page if user is found and password is correct
        });
      }
    })(req, res);
  };
};

// TODO: check roles of access and manage route modules
/**
 * Check if user is authorized to access the route
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {Function | void}
 */
const authorizedRoutesBasedOnRole = (req, res, next) => {
  switch (req.user._doc.role) {
    case ADMIN:
      [HOME].includes(req.path) ? next() : res.redirect(HOME);
      break;
    case USER:
      [HOME].includes(req.path) ? next() : res.redirect(HOME);
      break;
    case PARTICIPANT:
      [HOME].includes(req.path) ? next() : res.redirect(HOME);
      break;
    default:
      req.flash(ERROR, "You are not authorized to view this page.");
      return res.redirect(HOME);
  }
  next();
};

/**
 * Check if user is authenticated and redirect to login page if not
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {Function | void}
 */
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash(ERROR, "You must be logged in to view this page.");
  res.redirect(LOGIN);
};

/**
 * Log out user and redirect to home page if user is logged in or redirect to login page if user is not logged in
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {void}
 */
const logOut = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(LOGIN);
  });
};

module.exports = {
  authenticateUser,
  ensureAuthenticated,
  logOut,
  authorizedRoutesBasedOnRole,
  sendVerificationEmail,
};
