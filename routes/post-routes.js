const express = require('express');
const router  = express.Router();

const {} = require

// /login

router.post('/login', (req, res) => {

});

// /register

router.post('/register', (req, res) => {

});

// /:id/delete

router.post('/:id/delete', (req, res) => {
  //const userId = req.id
  // deleteUser(userID)
});

// /passwords

router.post('/passwords', (req, res) => {
  // const userId = req.session.user_id
  // const label = req.body.label
  // const username = req.body.username
  // const category = req.body.category
  // const org_id = getUserById(userId)
  // addPassword(userId, label, username, password, category, org_id)
});

// /passwords/:id

router.post('/passwords/:id', (req, res) => {

});

// /passwords/:id/delete

router.post('//passwords/:id/delete', (req, res) => {
  // passwordId = req.params.id
  // deletePassword(passwordId)
});e

// /orgs

router.post('/orgs', (req, res) => {
  // orgName = req.body.orgName
  // addOrg(orgName)
  // TODO: how do we add users to org?
});

// /org/:id

router.post('/orgs/:id', (req, res) => {

});

// /orgs/:id/delete

router.post('/orgs/:id/delete', (req, res) => {
  // orgName = req.params.id
  // delete(Org)
});

// /orgs/:id/userid

router.post('/orgs/:id/:userid', (req, res) => {
  // if (isUserInOrg(user_id))
  // updateUserInOrg(org)
  // orgId = req.params.id
  // userId = req.cookies.user_id
  // isAdmin = false;
  // TODO: how do we authenticate admin privs?
  // addUserToOrg(orgId, userID, isAdmin)
});

// /orgs/:id/:userid/delete

router.post('/orgs/:id/:userid/delete', (req, res) => {

});


