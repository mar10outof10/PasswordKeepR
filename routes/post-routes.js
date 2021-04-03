const express = require('express');
const router  = express.Router();

const {} = require('')
const cookieSession = require('cookie-session');

const { addPassword, editPassword, deletePassword } = require('../db/queries/password-queries')
const { addOrg, userIsOrgAdmin, userIsInOrg } = require('../db/queries/org-queries')
const { getUserByEmail, addUser, deleteUser, getUserById } = require('../db/queries/user-queries')

// User login

router.post('/login', (req, res) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    return;
  }
  const email = req.body.email;
  const password = req.body.password;
  getUserByEmail(email)
  .then(userObject => {
    if (password === userObject.password) {
      // add usercookie
      return res.redirect('/passwords');
    }
  })
  return res.redirect('/login');
})

// Register user

router.post('/register', (req, res) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    return;
  }
  const email = req.params.email;
  const password = req.params.password;;
  addUser(email, password)
  .then(user => {
    res.json(user);
  })
});

// Delete user

router.post('/:id/delete', (req, res) => {
  // if user is not logged in, deny request
  const userIdCookie = req.session.user_id;
  if (!userIdCookie) {
    return;
  }
  const userId = req.params.id;
  getUserById(userIdCookie)
  .then(userObject => {
    if (userObject.userId === userId) {
      deleteUser(userId)
      .then(rowcount => {
        res.send(rowcount);
        return res.redirect('/login');
      })
    }
    return;
  })
});


// Add password

router.post('/passwords', (req, res) => {
  const userIdCookie = req.session.user_id;
  if (!userIdCookie) {
    return;
  }
  const label = req.body.label;
  const username = req.body.usernamew;
  const password = req.body.password
  const category = req.body.category;
  const orgId = req.body.orgId
  const userId = req.session.user_id;
  const newPassObj = {
    label,
    username,
    password,
    category,
    orgId,
    userId
  }
  addPassword(newPassObj)
  .then(newPassObj => {
    res.json(newPassObj);
  })
})


// Edit individual password

router.post('/passwords/:id', (req, res) => {
  const label = req.body.label;
  const username = req.body.usernamew;
  const password = req.body.password
  const category = req.body.category;
  // how do we determine org?
  const orgId = req.body.orgId
  const userId = req.session.user_id;
  const passwordId = req.params.id;
  const newPassObj = {
    label,
    username,
    password,
    category,
    userId,
    orgId,
    passwordId
  }
  editPassword(editPassObj)
  .then(editedPassObj => {
    res.json(editedPassObj);
  })
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


// TODO -
// add cookies
// encrypt password

