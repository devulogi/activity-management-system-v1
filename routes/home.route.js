const homeController = require('../controllers/home.controller');
const routes = require('express').Router();

routes.route('/')
    .get(homeController); // GET / - Home page

module.exports = routes;