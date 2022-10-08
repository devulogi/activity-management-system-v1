const { authenticateUser } = require("../helper");
const { LOGIN } = require("../constants").APP_ROUTES;
const getLoginController = (req, res) => {
  res.render("login", { title: "Login", path: LOGIN });
};

const postLoginController = (req, res, next) => {
  /**
   * authenticate user and redirect to home page
   * isNewUser = false (default) because user already exists
   */
  authenticateUser(false)(req, res, next);
};

module.exports = {
  getLoginController,
  postLoginController,
};
