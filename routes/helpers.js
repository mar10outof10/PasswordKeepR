const isAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
<<<<<<< HEAD
=======
    // console.log('middleware passed')
>>>>>>> master
    return next();
  }
  // return res.redirect('/login', { errorMsg: 'You must be logged in to view passwords' });
  return res.redirect('/login');
}

const isNotAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return res.redirect('/passwords');
  }
<<<<<<< HEAD
  next();
=======
  // console.log('middleware passed')
  return next();
>>>>>>> master
}

module.exports = { isAuthenticated, isNotAuthenticated }
