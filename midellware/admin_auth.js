// midellware/admin_auth.js
module.exports = function (req, res, next) {
  try {
    // ensure user is authenticated by existing users_auth middleware first
    if (!req.user) return res.redirect('/login');

    // require admin role
    if (req.user.role !== 'admin') {
      // for API calls you could return 403, but for UI redirect back to dashboard
      return res.status(403).send('Forbidden: admin only');
    }

    next();
  } catch (err) {
    console.error('admin_auth error:', err);
    return res.redirect('/login');
  }
};
