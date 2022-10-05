const routes = require('express').Router();
const {getLoginController, postLoginController} = require("../controllers/login.controller");

routes.route('/')
    .get(getLoginController) // GET /login - Login page
    .post(postLoginController); // POST /login - Login page

module.exports = routes;
