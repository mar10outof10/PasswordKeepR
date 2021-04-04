const express = require('express');
const router  = express.Router();

const { getAllPasswords, getPasswordById, addPassword, editPassword, deletePassword} = require('../db/queries/password-queries')
const { isAuthenticated } = require('./helpers')

/* Password dashboard
* logged in user  -> go to /passwords
* else            -> go to /login
*/
router.get('/', isAuthenticated, (req, res) => {
  userIdCookie = req.session.user_id;
  getAllPasswords(userIdCookie)
  .then(passwords => {
    return res.send(passwords);
      // const templateVars = { passwords }
      // return res.render('passwords', templateVars);
  })
  .catch(err => {
    return res.redirect('/login', { errorMsg: "error retreiving user passwords" });
  })
})

/* New password form
* logged in user  -> go to /passwords/new
* else            -> go to /login
*/
router.get('/new', isAuthenticated, (req, res) => {
    return res.send('password form')
    // const templateVars = { user: userIdCookie }
    // return res.render('password/new', templateVars);
});

/* Show individual password
* logged in user  -> go to /passwords/:id
* else            -> go to /login
*/
router.get('/:id', isAuthenticated,  (req, res) => {
  const passwordId = req.params.id;
  getPasswordById(passwordId)
  .then(password => {
    return res.send(password)
  // const templateVars = { password , user: userIdCookie }
  // return res.render('/password/:id', templateVars)
  })
  .catch(err => {
    res.redirect('/login', { errorMsg: 'This password doesn\'t exist' });
  })
});


/* Add new password
* logged in user  -> add new password to Db
* else            -> go to /login
*/
router.post('/', isAuthenticated, (req, res) => {
  const { label, username, password, category, orgId } = req.body;
  const newPassObj = { label, username, password, category, orgId, userId }
  addPassword(newPassObj)
  .then(newPassObj => {
    res.json(newPassObj);
  })
  .catch(err => {
    res.json(err);
  })
})


/* Show individual password
* logged in user  -> edit inidivual password in Db
* else            -> go to /login
*/
router.post('/:id', isAuthenticated, (req, res) => {
  const { label, username, password, category, orgId } = req.body;
  const editPassObj = { label, username, password, category, userId, orgId, passwordId}
  editPassword(editPassObj)
  .then(editedPassObj => {
    res.json(editedPassObj);
  })
  .catch(err => {
    res.json(err);
  })
});

/* Delete individual password
* logged in user  -> Delete password from Db
* else            -> go to /login
*/
router.post('/:id/delete', isAuthenticated, (req, res) => {
  const passwordId = req.params.id;
  getPasswordById(passwordId)
  .then(passwordObj => {
    userIdCookie = req.params.user_id;
    if (passwordObj.userId === userIdCookie) {
      deletePassword(passwordId)
      .then(rowCount => {
        res.json(rowCount);
        // res.redirect('/passwords');
      })
      .catch(err => {
        res.json(err);
      })
    }
  })
});

module.exports = router;
