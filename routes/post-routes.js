const express = require('express');
const router  = express.Router();

const cookieSession = require('cookie-session');

const { addPassword, editPassword, deletePassword, getPasswordById } = require('../db/queries/password-queries')
const { addOrg, userIsOrgAdmin, userIsInOrg, addUserToOrg } = require('../db/queries/org-queries')
const { getUserByEmail, addUser, deleteUser, getUserById } = require('../db/queries/user-queries');
const { json } = require('body-parser');
const { isUserLoggedIn } = require('./helpers')


// User login

router.post('/login', (req, res) => {
  if (isUserLoggedIn(req)) {
    res.end;
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
  if (isUserLoggedIn(req)) {
    res.end;
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


// Add password

router.post('/passwords', (req, res) => {
  const userIdCookie = req.session.user_id;
  if (isUserLoggedIn(req)) {
    res.end;
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
    // cleaner way to write this or helper function?
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
  const orgId = req.body.orgId
  const userId = req.session.user_id;
  const passwordId = req.params.id;
  const editPassObj = {
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

// Delete password

router.post('/passwords/:id/delete', (req, res) => {
  if (isUserLoggedIn(req)) {
    res.end;
  }
  const passwordId = req.params.id;
  getPasswordById(passwordId)
  .then(passwordObj => {
    if (passwordObj.userId === userIdCookie) {
      deletePassword(passwordId)
      .then(rowCount => {
        // res.json(rowCount);
        res.redirect('/passwords');
      })
    }
  })
});

// Add new Org

router.post('/orgs', (req, res) => {
  if (isUserLoggedIn(req)) {
    res.end;
  }
  const userId = req.session.user_id;
  const orgName = req.body.orgName;
  addOrg(orgName)
  .then(orgObject => {
    const orgId = orgObject.id;
    addUserToOrg(userId, orgId, true);
    return res.json(orgObject);
  });
});

// Edit org

router.post('/orgs/:id', (req, res) => {
  if (isUserLoggedIn(req)) {
    res.end;
  }
  const orgId = req.params.id
  const userId = req.session.user_id;
  userIsOrgAdmin(userId, orgId)
  .then(bool => {
    if (bool) {
      const orgName = req.body.org_name;
      editOrg(orgId, orgName)
      .then(orgObject => {
        return res.json(orgObject);
      })
    }
    // error: insufficient privledges
  })
});

// Delete Org

router.post('/orgs/:id', (req, res) => {
  if (isUserLoggedIn(req)) {
    res.end;
  }
  // check if user is admin of org
  const orgId = req.params.id
  const userId = req.session.user_id;
  userIsOrgAdmin(userId, orgId)
  .then(bool => {
    if (bool) {
      deleteOrg(orgId)
      .then(rowCount => {
        return res.send(rowCount);
      })
    }
    res.send('error');
  })
});


// Add user to org

router.post('/orgs/:id/:userid', (req, res) => {
  const orgId = req.params.id
  const userId = req.cookies.user_id
  userIsOrgAdmin(userId, orgId)
  .then(bool => {
    if (bool) {
      const userId = rew.params.userid
      addUserToOrg(userId, orgId, false);
    }
  })
  res.send('error');
});

// Remove user from org

router.post('/orgs/:id/:userid/delete', (req, res) => {
  const orgId = req.params.id
  const userId = req.params.user_id
  const adminId = req.cookies.user_id
  userIsOrgAdmin(userId, orgId)
  .then(bool => {
    if (bool) {
      if (adminId !== userId) {
        deleteUserFromOrg(userId, orgId);
        return res.redirect('/orgs/:id');
      }
      deleteUserFromOrg(userId, orgId);
      res.redirect('/orgs');
    }
  })
  res.send('error');
});

module.exports = router;


