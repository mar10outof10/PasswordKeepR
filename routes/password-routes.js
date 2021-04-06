const express = require('express');
const router  = express.Router();

const { getAllPasswords, getPasswordById, addPassword, editPassword, deletePassword } = require('../db/queries/password-queries');
const { getUserById } = require('../db/queries/user-queries');
const { getAllOrgs } = require('../db/queries/org-queries');
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
    console.log('passwords', values[0])
    return res.render('passwords_index', { passwords: values[0], email: values[1].email });
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

  const getUserPromise = getUserById(userId);
  const getOrgsPromise = getAllOrgs(userId);

  Promise.all([getUserPromise, getOrgsPromise])
  .then(values => {
    const user = values[0];
    const orgs = values[1];
    console.log(orgs);
    return res.render('passwords_new', { email: user.email, orgs });
  });
});

/* Show individual password
* logged in user  -> go to /passwords/:id
* else            -> go to /loginf
*/
router.get('/:id', isAuthenticated,  (req, res) => {
  const passwordId = req.params.id;
  const userId = req.session.user_id;

  const getPasswordPromise = getPasswordById(passwordId);
  const getUserPromise = getUserById(userId);
  const getOrgsPromise = getAllOrgs(userId);

  Promise.all([getPasswordPromise, getUserPromise, getOrgsPromise])
  .then(values => {
    const password = values[0];
    const user = values[1];
    const orgs = values[2];

    return res.render('passwords_show', { password, email: user.email, orgs });
  });
});


/* Add new password
* logged in user  -> add new password to Db
* else            -> go to /login
*/
router.post('/', isAuthenticated, (req, res) => {
  const { label, url, username, password, category, orgId } = req.body;
  const userId = req.session.user_id;
  const newPassObj = { label, url, username, password, category, orgId, userId }
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
  const { label, url, username, password, category, orgId } = req.body;
  const userId = req.session.user_id;
  const passwordId = req.params.id;
  const editPassObj = { label, url, username, password, category, userId, orgId };
  editPassword(passwordId, editPassObj)
  .then(editedPassObj => {
    // res.json(editedPassObj);
    res.redirect(`/passwords/${passwordId}`);
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
    const userIdCookie = req.session.user_id;
    if (passwordObj.user_id === userIdCookie) {
      return deletePassword(passwordId)
    }
    return Promise.reject(500);
  })
  .then(rowCount => {
    res.redirect('/passwords');
  })
  .catch(err => {
    res.json(err);
  })
});


module.exports = router;
