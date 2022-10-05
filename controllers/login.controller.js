const {authenticateUser} = require("../helper");
const getLoginController = (req, res) => {
    res.render('login', {title: 'Login'});
}

const postLoginController = (req, res, next) => {
    authenticateUser(req, res, next);
}

module.exports = {
    getLoginController,
    postLoginController
}