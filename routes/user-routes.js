const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const { isUserLoggedIn } = require('./helpers');
const { getUserByEmail, getUserById, addUser } = require('../db/queries/user-queries');

/* Root
* logged in user  -> go to /passwords
* else            -> go to /login
*/
router.get('/', (req, res) => {
  if (isUserLoggedIn(req)) {
    return res.redirect('/passwords');
  }
  return res.redirect('/login');
});

/* Login page
* logged in user -> go to /passwords
* else           -> render login page
*/
router.get('/login', (res, req) => {
  if (isUserLoggedIn(req)) {
    return res.redirect('/passwords');
  }
  return res.render('login');
});

// Handle user login
router.post('/login', (req, res) => {
  if (isUserLoggedIn(req)) {
    return res.end();
  }

  const { email, password } = req.body;

  // check email/password were provided
  if (!email || !password) {
    return res.render('login', { errorMsg: 'Email and password are required' });
  }

  getUserByEmail(email)
  .then(userObject => {
    if (!userObject) {
      // user with this email doesn't exist -> render /login with error msg
      return res.render('login', { errorMsg: 'User doesn\'t exist' });
    }

    // check password matches
    bcrypt.compare(password, userObject.password)
    .then(match => {
      if (match) {
        // password matches -> set cookie and redirect to '/'
        req.session.user_id = userObject.id;
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

// Register user
router.post('/register', (req, res) => {
  // check user is not logged in already
  if (isUserLoggedIn(req)) {
    return res.end();
  }

  const { email, password } = req.body;

  // check email & password were provided
  if (!email || !password) {
    return res.send('Must provide username and password');
  }

  // hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // add the user to the db & store the new user_id in the cookie
  addUser(email, hashedPassword)
  .then(user => {
    req.session.user_id = user.id;
    return res.json(user);
  })
  .catch(err => {
    return res.json(err);
  });
});

// Delete user
router.post('/:id/delete', (req, res) => {
  if (isUserLoggedIn(req)) {
    res.end;
  }
  const userId = req.params.id;
  getUserById(userIdCookie)
  .then(userObject => {
    if (userObject.userId === userId) {
      deleteUser(userId)
      .then(rowcount => {
        // res.send(rowcount);
        return res.redirect('/login');
      })
    }
    res.end;
  })
});



// Render register page

router.get('/register', (res, req) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    return res.redirect('/passwords');
  }
  res.render('register');
});

module.exports = router;
