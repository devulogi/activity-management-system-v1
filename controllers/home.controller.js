const { HOME } = require("../constants").APP_ROUTES;

const homeController = (req, res) => {
  res.render("index", {
    title: "Home",
    path: HOME,
  });
};

module.exports = homeController;
