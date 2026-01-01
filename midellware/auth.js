// midellware/auth.js (user authentication)
const jwt = require('jsonwebtoken');
const UserModel = require('../model/UserModel');

const users_auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect('/login');

    const decoded = jwt.verify(token, 'jayrajrao8269');
    const user = await UserModel.findById(decoded.id).lean();
    if (!user) return res.redirect('/login');

    req.user = user; // attach user to request
    next();
  } catch (err) {
    // invalid token or other error
    return res.redirect('/login');
  }
};

module.exports = users_auth;
