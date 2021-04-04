const isAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return next();
  }
  // return res.redirect('/login', { errorMsg: 'You must be logged in to view passwords' });
  return res.redirect('/login');
}

const isNotAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return res.redirect('/passwords');
  }
  next();
}

module.exports = { isAuthenticated, isNotAuthenticated }
