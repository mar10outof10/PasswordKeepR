const express = require('express');
const router  = express.Router();

const { getAllPasswords, getPasswordById, addPassword, editPassword, deletePassword } = require('../db/queries/password-queries');
const { getUserById } = require('../db/queries/user-queries');
const { isAuthenticated } = require('./helpers');

/* Password dashboard
* logged in user  -> render passwords_index
* else            -> go to /login
*/
router.get('/', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;
  const passwordsPromise = getAllPasswords(userId);
  const userPromise = getUserById(userId);

  Promise.all([passwordsPromise, userPromise])
  .then(values => {
    return res.render('passwords_index', { passwords: values[0], email: values[1].email, userId: userId });
  })
  .catch(err => {
    return res.json(err);
    // return res.redirect('/login', { errorMsg: "error retreiving user passwords" });
  });
});

/* New password form
* logged in user  -> go to /passwords/new
* else            -> go to /login
*/
router.get('/new', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;
  return res.render('passwords_new', { userId });
});

/* Show individual password
* logged in user  -> go to /passwords/:id
* else            -> go to /loginf
*/
router.get('/:id', isAuthenticated,  (req, res) => {
  const passwordId = req.params.id;
  const userId = req.params.user_id;
  getPasswordById(passwordId)
  .then(password => {
    // // console.log(password);
    // return res.send(password)
  return res.render('passwords_show', { password , userId })
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
  console.log(req.body)
  const { label, username, password, category, orgId } = req.body;
  const userId = req.session.user_id;
  const newPassObj = { label, username, password, category, orgId, userId }
  addPassword(newPassObj)
  .then(password => {
    // res.json(newPassObj);
    res.redirect('/passwords');
  })
  .catch(err => {
    res.json(err);
  })
})


/* Edit individual password
* logged in user  -> edit inidivual password in Db
* else            -> go to /login
*/
router.post('/:id', isAuthenticated, (req, res) => {
  const { label, username, password, category, orgId } = req.body;
  const userId = req.session.user_id;
  const editPassObj = { label, username, password, category, userId, orgId, passwordId}
  editPassword(editPassObj)
  .then(editedPassObj => {
    // res.json(editedPassObj);
    res.redirect('passwords_show');
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
    const userIdCookie = req.params.user_id;
    if (passwordObj.userId === userIdCookie) {
      deletePassword(passwordId)
      .then(rowCount => {
        res.json(rowCount);
        res.redirect('passwords_index');
      })
      .catch(err => {
        res.json(err);
      })
    }
  })
});

module.exports = router;
