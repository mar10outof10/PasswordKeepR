const express = require('express');
const router  = express.Router();

const {} = require('')
const cookieSession = require('cookie-session');

const { addPassword, editPassword, deletePassword } = require('../db/queries/password-queries')
const { addOrg, userIsOrgAdmin, userIsInOrg } = require('../db/queries/org-queries')
const { getUserByEmail, addUser, deleteUser, getUserById } = require('../db/queries/user-queries')

// User login

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  getUserByEmail()
  .then(userObject => {
    if (password === userObject.password) {
      res.redirect('/passwords');
    }
  })
  // add cookie
  res.redirect('/passwords');
})

// Register user

router.post('/register', (req, res) => {
  const email = req.params.email;
  const password = req.params.password;;
  addUser(email, password)
  .then()
});

// Delete user

router.post('/:id/delete', (req, res) => {
  const userId = req.id;
  deleteUser(userID)
  .then();
});

// Add password

router.post('/passwords', (req, res) => {
  const userId = req.session.user_id;
  const label = req.body.label;
  const username = req.body.usernamew;
  const category = req.body.category;
  getUserById(userId)
  .then(userObject => {
    addPassword(userObject)
    // figure out how to pass the password properly
    .then()
  })
});

// Edit individual password

router.post('/passwords/:id', (req, res) => {
  const userId = req.session.user_id;
  const label = req.body.label;
  const username = req.body.usernamew;
  const category = req.body.category;
  const org_id = getUserById(userId);
  editPassword(userId, label, username, password, category, org_id)
  .then()
});

// Delete passwords

router.post('//passwords/:id/delete', (req, res) => {
  passwordId = req.params.id
  deletePassword(passwordId)
  .then();
});

// Add new Org

router.post('/orgs', (req, res) => {
  orgName = req.body.orgName
  addOrg(orgName)
  .then();
  // TODO: how do we add users to org?
});

// Add Org

router.post('/orgs/:id', (req, res) => {
  const orgName = req.params.org_name;
  addOrg(orgName)
  .then()
});

// Delete Org

router.post('/orgs/:id/delete', (req, res) => {
  const userId = req.session.user_id;
  const orgId = req.params.id
  userIsOrgAdmin(userId, orgID)
  .then(bool => {
    if (bool) {
      deleteOrg(orgName)
    }
  })
  // Error - insufficient priledges
});

// /orgs/:id/userid

router.post('/orgs/:id/:userid', (req, res) => {
  const orgId = req.params.id
  const userId = req.cookies.user_id
  const isAdmin = false;
  userIsInOrg(userId, orgId)
  .then(bool => {
    updateUserInOrg(orgId, userID, isAdmin);
  })
  // TODO: how do we authenticate admin privs?
});

// /orgs/:id/:userid/delete

router.post('/orgs/:id/:userid/delete', (req, res) => {
  const orgId = req.params.id
  const AdminId = req.cookies.user_id
  const userId = req.params.user_id
  userIsOrgAdmin(adminId, orgId)
  .then(bool => {
    if (bool) {
      deleteUserFromOrg(orgNAme, userId)
    }
  })
  // return error if user is not admin
});


