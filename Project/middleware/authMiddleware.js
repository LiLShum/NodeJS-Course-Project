const jwt = require("jsonwebtoken");
const tokenKey = "borisov-900";
const usersAPI = require("../db/userAPI");


const handleToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
        jwt.verify(accessToken, tokenKey , (err, payload) => {
            if (err) {
                return res.render('login');
            } else if (payload) {
                req.payload = payload;
                next();
            }
        })
    } else
        return res.render('login');
}

module.exports = {
    handleToken
};