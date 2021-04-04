const isAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return next();
  }
  return res.redirect('/login', { errorMsg: 'You must be logged in to view passwords' });
}

module.exports = { isAuthenticated }
