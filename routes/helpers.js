const isAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return next();
  }
  res.send('stopped by middleware')
}

module.exports = { isAuthenticated }
