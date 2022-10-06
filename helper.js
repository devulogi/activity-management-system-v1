const passport = require("passport");
const { APP_ROUTES, FLASH_MESSAGE_TYPES, ROLES } = require("./constants");
const { HOME, LOGIN } = APP_ROUTES;
const { SUCCESS, INFO, ERROR } = FLASH_MESSAGE_TYPES;
const { ADMIN } = ROLES;

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
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err); // will generate a 500 error (Internal Server Error)
      }
      if (!user) {
        req.flash(ERROR, info.message); // will generate a 401 error (Unauthorized)
        return res.redirect(LOGIN); // redirect back to login page if user not found or password is incorrect
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err); // will generate a 500 error (Internal Server Error)
        }
        if (isNewUser) {
          req.flash(SUCCESS, "Welcome new user!");
        } else {
          req.flash(INFO, "You have successfully logged in.");
        }
        return res.redirect(HOME); // redirect to home page if user is found and password is correct
      });
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
const authorizedRoutesBasedOneRole = (req, res, next) => {
  if (req.user.role === ADMIN) {
    if (["/profile", "/activity", "/users"].includes(req.path.url)) {
      return next();
    }
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
  req.flash(ERROR, "You must be logged in to view this page");
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
  authorizedRoutesBasedOneRole,
};
