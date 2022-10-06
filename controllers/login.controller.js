const { authenticateUser } = require("../helper");
const getLoginController = (req, res) => {
  res.render("login", { title: "Login" });
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
