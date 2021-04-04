const isAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return next();
  }
  return res.redirect('/login', { errorMsg: 'You must be logged in to view passwords' });
}

const isNotAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return res.redirect('/passwords', { errorMsg: 'You must be logged in to view passwords' });
  }
  return next();
}

module.exports = { isAuthenticated }
