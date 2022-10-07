const routes = require("express").Router();
const { APP_ROUTES, FLASH_MESSAGE_TYPES } = require("../constants");
const { HOME, SIGN_UP, LOGIN, LOGOUT } = APP_ROUTES;
const { SUCCESS, INFO, ERROR } = FLASH_MESSAGE_TYPES;

const {
  ensureAuthenticated,
  authorizedRoutesBasedOneRole,
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
  [ensureAuthenticated, authorizedRoutesBasedOneRole],
  require("./home.route")
); // GET / - Home page
routes.use(SIGN_UP, require("./signup.route"));
routes.use(LOGIN, require("./login.route"));
routes.get(LOGOUT, logOut);

module.exports = routes;
