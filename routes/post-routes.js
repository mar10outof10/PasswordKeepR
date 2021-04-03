const express = require('express');
const router  = express.Router();

const {} = require

// /login

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // check passwoprd
  let userObject = getUserByEmail()
    if (password === userObject.password) {
    res.redirect('/passwords')
  }
  // add cookie
  // TODO - write helper function cookie
  // redirect to password dashboard
  res.redirect('/passwords')
});

// /register

router.post('/register', (req, res) => {
  const email = req.params.email;
  const password = req.params.password;;
  addUser(email, password);
});

// /:id/delete

router.post('/:id/delete', (req, res) => {
  const userId = req.id;
  deleteUser(userID);
});

// /passwords

router.post('/passwords', (req, res) => {
  const userId = req.session.user_id;
  const label = req.body.label;
  const username = req.body.usernamew;
  const category = req.body.category;
  const org_id = getUserById(userId);
  addPassword(userId, label, username, password, category, org_id);
});

// Edit individual password

router.post('/passwords/:id', (req, res) => {
  const userId = req.session.user_id;
  const label = req.body.label;
  const username = req.body.usernamew;
  const category = req.body.category;
  const org_id = getUserById(userId);
  editPassword(userId, label, username, password, category, org_id);
});

// /passwords/:id/delete

router.post('//passwords/:id/delete', (req, res) => {
  passwordId = req.params.id
  deletePassword(passwordId)
});e

// /orgs

router.post('/orgs', (req, res) => {
  orgName = req.body.orgName
  addOrg(orgName)
  // TODO: how do we add users to org?
});

// Add Org

router.post('/orgs/:id', (req, res) => {
  const orgName = req.params.org_name;
  addOrg(orgName)
});

// Delete Org

router.post('/orgs/:id/delete', (req, res) => {
  const userId = req.session.user_id;
  const orgId = req.params.id
  if (userIsOrgAdmin(userId, orgID)) {
    deleteOrg(orgName);
    return;
  }
  // Error - insufficient priledges
});

// /orgs/:id/userid

router.post('/orgs/:id/:userid', (req, res) => {
  const orgId = req.params.id
  const userId = req.cookies.user_id
  const isAdmin = false;
  if (isInOrg(userId, orgId)) {
    updateUserInOrg(orgId, userID, isAdmin);
    return;
  }
  // TODO: how do we authenticate admin privs?
  addUserToOrg(orgId, userID, isAdmin)
});

// /orgs/:id/:userid/delete

router.post('/orgs/:id/:userid/delete', (req, res) => {
  const orgId = req.params.id
  const AdminId = req.cookies.user_id
  const userId = req.params.user_id
  if (isOrgAdmin(adminId, orgId)) {
    deleteUserFromOrg((orgNAme, userId))
  }
  // return error if user is not admin
});


