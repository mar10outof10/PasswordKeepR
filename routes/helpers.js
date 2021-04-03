const isUserLoggedIn = (req) => {
  return (req.session.user_id);
}

const addUserCookie = (userId) => {
// add and store user cookie
}

module.exports = { isUserLoggedIn }
