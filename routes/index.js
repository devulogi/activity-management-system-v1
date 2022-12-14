const routes = require("express").Router();
const { APP_ROUTES, FLASH_MESSAGE_TYPES } = require("../constants");
const { HOME, SIGN_UP, LOGIN, LOGOUT, VERIFY_EMAIL } = APP_ROUTES;
const { SUCCESS, INFO, ERROR } = FLASH_MESSAGE_TYPES;

const {
  ensureAuthenticated,
  authorizedRoutesBasedOnRole,
  logOut,
} = require("../helper"); // helper functions

// every view will now have access to the user object (if logged in)
routes.use((req, res, next) => {
  res.locals.user = req.user; // user object
  res.locals.successes = req.flash(SUCCESS); // flash messages for success messages (green)
  res.locals.infos = req.flash(INFO); // flash messages for info messages (blue)
  res.locals.errors = req.flash(ERROR); // flash messages for error messages (red)
  next(); // continue to next middleware
});

routes.get(
  HOME,
  [ensureAuthenticated, authorizedRoutesBasedOnRole],
  require("./home.route")
); // GET / - Home page
routes.use(SIGN_UP, require("./signup.route")); // GET /signup - Sign up page
routes.use(LOGIN, require("./login.route")); // GET /login - Login page
routes.get(LOGOUT, logOut); // GET /logout - Logout page
routes.get(
  VERIFY_EMAIL,
  require("../controllers/email.confirmation.controller")
); // GET /confirmation/:token - Confirmation page

module.exports = routes;
