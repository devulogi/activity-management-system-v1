const routes = require("express").Router();
const {
  ensureAuthenticated,
  authorizedRoutesBasedOneRole,
  logOut,
} = require("../helper");

// every view will now have access to the user object (if logged in)
routes.use((req, res, next) => {
  res.locals.user = req.user; // user object
  res.locals.successess = req.flash("success"); // flash messages for success messages (green)
  res.locals.infos = req.flash("info"); // flash messages for info messages (blue)
  res.locals.errors = req.flash("error"); // flash messages for error messages (red)
  next(); // continue to next middleware
});

routes.get(
  "/",
  [ensureAuthenticated, authorizedRoutesBasedOneRole],
  require("./home.route")
); // GET / - Home page
routes.use("/signup", require("./signup.route"));
routes.use("/login", require("./login.route"));
routes.get("/logout", logOut); // GET /logout - Logout page

module.exports = routes;
