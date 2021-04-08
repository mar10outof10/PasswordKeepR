const express = require('express');
const router  = express.Router();

const { getAllPasswords, getAllPasswordsSearch, getPasswordById, addPassword, editPassword, deletePassword } = require('../db/queries/password-queries');
const { isAuthenticated, hasPasswordWriteAccess, hasOrgWriteAccess } = require('./helpers');
const { getAllOrgsWhereAdmin } = require('../db/queries/org-queries');
const { getUserById } = require('../db/queries/user-queries');

/* Password dashboard
* logged in user  -> render passwords_index
* else            -> go to /login
*/
router.get('/', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;
  const passwordsPromise = getAllPasswords(userId);
  const userPromise = getUserById(userId);

  Promise.all([passwordsPromise, userPromise])
  .then(values => res.render('passwords_index', { passwords: values[0], email: values[1].email }))
  .catch(err => res.status(500).send(err));
});

/* New password form
* logged in user  -> go to /passwords/new
* else            -> go to /login
*/
router.get('/new', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;
  const getUserPromise = getUserById(userId);
  const getOrgsPromise = getAllOrgsWhereAdmin(userId);

  Promise.all([getUserPromise, getOrgsPromise])
  .then(values => {
    const [user, orgs] = values;
    return res.render('passwords_new', { email: user.email, orgs });
  })
  .catch(err => res.status(500).send(err));
});

/* Show individual password
* logged in user  -> go to /passwords/:id
* else            -> go to /login
*/
router.get('/:id', isAuthenticated, hasPasswordWriteAccess, (req, res) => {
  const passwordId = req.params.id;
  const userId = req.session.user_id;

  const getUserPromise = getUserById(userId);
  const getOrgsPromise = getAllOrgsWhereAdmin(userId);
  const getPasswordPromise = getPasswordById(passwordId);

  Promise.all([getPasswordPromise, getUserPromise, getOrgsPromise])
  .then(values => {
    const [password, user, orgs] = values;
    return res.render('passwords_show', { password, email: user.email, orgs });
  });
});


/* Add new password
* logged in user  -> add new password to Db
* else            -> go to /login
*/
router.post('/', isAuthenticated, hasOrgWriteAccess, (req, res) => {
  const { label, url, username, password, category, orgId } = req.body;
  const userId = req.session.user_id;
  const passwordObj = { label, url, username, password, category, orgId, userId }

  addPassword(passwordObj)
  .then(() => res.redirect('/passwords'))
  .catch(err => res.status(500).send(err));
});


/* Edit individual password
* logged in user  -> edit inidivual password in Db
* else            -> go to /login
*/
router.post('/:id', isAuthenticated, hasPasswordWriteAccess, hasOrgWriteAccess, (req, res) => {
  const { label, url, username, password, category, orgId } = req.body;
  const userId = req.session.user_id;
  const passwordId = req.params.id;
  const passwordObj = { label, url, username, password, category, userId, orgId };

  editPassword(passwordId, passwordObj)
  .then(() => res.redirect('/passwords'))
  .catch(err => res.status(500).send(err));
});

/* Delete individual password
* logged in user  -> Delete password from Db
* else            -> go to /login
*/
router.post('/:id/delete', isAuthenticated, hasPasswordWriteAccess, (req, res) => {
  const passwordId = req.params.id;
  deletePassword(passwordId)
  .then(() => res.redirect('/passwords'))
  .catch(err => res.status(500).send(err))
});

/* Password dashboard, filtered by a search query applied to password labels and URLs
* logged in user  -> Delete password from Db
* else            -> go to /login
*/
router.get('/search/:query', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;
  const searchQuery = req.params.query.trim();

  const passwordsPromise = getAllPasswordsSearch(userId, searchQuery);
  const userPromise = getUserById(userId);

  Promise.all([passwordsPromise, userPromise])
  .then(values => res.render('passwords_index', { passwords: values[0], email: values[1].email, searchQuery }))
  .catch(err => res.status(500).send(err));
});

module.exports = router;
