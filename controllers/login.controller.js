const getLoginController = (req, res) => {
    res.render('login', { title: 'Login' });
}

const postLoginController = async (req, res) => {}

module.exports = {
    getLoginController,
    postLoginController
}