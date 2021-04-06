const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { isAuthenticated, isNotAuthenticated } = require('./helpers');
const { getUserByEmail, addUser, deleteUser, userEmailExists } = require('../db/queries/user-queries');

/* Root
* logged in user  -> go to /passwords
* else            -> go to /login
*/
router.get('/', isAuthenticated, (req, res) => {
  return res.redirect('/passwords');
});

/* Login page
* logged in user -> go to /passwords
* else           -> render login page
*/
router.get('/login', isNotAuthenticated, (req, res) => {
  return res.render('login');
});

// Handle user login
router.post('/login', isNotAuthenticated, (req, res) => {
  const { email, password } = req.body;

  // check email/password were provided
  if (!email || !password) {
    return res.render('login', { errorMsg: 'Email and password are required' });
  }

  getUserByEmail(email)
    .then(user => {
      if (!user) {
        // user with this email doesn't exist -> render /login with error msg
        return res.render('login', { errorMsg: 'User doesn\'t exist' });
      }

      // check password matches
      bcrypt.compare(password, user.password)
        .then(match => {
          if (match) {
            // password matches -> set cookie and redirect to '/'
            req.session.user_id = user.id;
            return res.redirect('/');
          }
          // password did not match -> render /login with error msg
          console.log('match', match);
          return res.render('login', { errorMsg: 'Invalid password' });
        })
        .catch(err => {
          // some bcrypt error occurred
          console.log(err);
          return res.send(err);
        });
    })
    .catch(err => {
      // some error occurred with psql query
      console.log(err);
      return res.send(err);
    });
});

/* Log out
* delete cookie, redirect to /
*/
router.post('/logout', (req, res) => {
  req.session = null;
  return res.redirect('/');
});

/* Register page
* logged in user -> go to /passwords
* else           -> render register page
*/
router.get('/register', isNotAuthenticated, (req, res) => {
  return res.render('register');
});

// Handle user registration
router.post('/register', isNotAuthenticated, (req, res) => {
  // check user is not logged in already
  const { email, password } = req.body;
  // check email & password were provided
  if (!email || !password) {
    return res.render('register', { errorMsg: 'Must provide username and password' });
  }
  // check email does not exist in system already
  userEmailExists(email)
    .then(id => {
      if (id) {
        return res.render('register', { errorMsg: 'email already exists in database' });
      }
      // hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);
      // add the user to the db & store the new user_id in the users' cookie
      addUser(email, hashedPassword)
        .then(user => {
          req.session.user_id = user.id;
          return res.redirect('/passwords');
        })
        .catch(() => res.send('super err'));
    })
    .catch(() => res.send('err'));
});

// Delete user
router.post('/:id/delete', isAuthenticated, (req, res) => {
  if (req.params.id !== req.session.user_id) {
    // user is trying to delete an account that isn't theirs
    return res.status(401).send();
  }

  // delete the user from users, remove cookie
  deleteUser(userId)
    .then(success => {
      if (success) {
        // user was deleted
        req.session = null;
        return res.redirect('/');
      }
      // user wasn't deleted
      return res.status(500).send();
    });
});

module.exports = router;
