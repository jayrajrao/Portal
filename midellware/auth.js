const jwt = require("jsonwebtoken");
const UserModel = require("../model/UserModel");

const users_auth = async (req, res, next) => {
  try {
    //console.log('Hello user')
    const { token } = req.cookies;
    //console.log(token)
    const verify_token = jwt.verify(token, "jayrajrao8269");
    //console.log(verify_token)
    next();
  } catch (error) {
    res.redirect("/login");
  }
};

module.exports = users_auth;
