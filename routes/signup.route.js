const routes = require('express').Router();
const {getSignUpController, postSignUpController} = require('../controllers/signup.controller');

routes.route('/')
    .get(getSignUpController) // GET /signup - Signup page
    .post(postSignUpController); // POST /signup - Signup page

module.exports = routes;