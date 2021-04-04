const bcrypt = require('bcrypt');
const express = require('express');
const router  = express.Router();

const { addPassword, editPassword, deletePassword, getPasswordById } = require('../db/queries/password-queries')
const { addOrg, userIsOrgAdmin, userIsInOrg, addUserToOrg } = require('../db/queries/org-queries')
const { getUserByEmail, addUser, deleteUser, getUserById } = require('../db/queries/user-queries');
const { json } = require('body-parser');
const { isUserLoggedIn } = require('./helpers')


// User login

router.post('/login', (req, res) => {
  if (isUserLoggedIn(req)) {
    return res.end();
  }

  const { email, password } = req.body;

  // check email/password were provided
  if (!email || !password) {
    return res.redirect('/login', { errorMsg: 'Email and password are required' });
  }

  // try
  getUserByEmail(email)
  .then(userObject => {
    // check password matches
    bcrypt.compare(password, userObject.password)
    .then(res => {
      // password matches -> set cookie and redirect to '/'
      req.session.user_id = userObject.id;
      return res.redirect('/');
    })
    .catch(err => {
      // password did not match -> render /login with error msg
      return res.render('login', { errorMsg: 'Invalid password' });
    });
  });
  // user with this email doesn't exist -> render /login with error msg
  return res.redirect('/login', { errorMsg: 'User doesn\'t exist' });
})

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
        res.redirect('/passwords')
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
  const orgName = req.body.orgName
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
  // check if user is admin of org
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
    // error: insufficient privledges
  })
});


// Add user to org

router.post('/orgs/:id/:userid', (req, res) => {
  const orgId = req.params.id
  const userId = req.cookies.user_id
  // we need feature on page to ask for admin privledges
  userIsOrgAdmin(userId, orgId)
  .then(bool => {
    // how can admin search for users to add?
    // check if user is already in org before adding
    addUserToOrg(userId, orgId, isAdmin);
  })
  // TODO: how do we authenticate admin privs?
});

// Remove user from org

router.post('/orgs/:id/:userid/delete', (req, res) => {
  const orgId = req.params.id
  const AdminId = req.cookies.user_id
  const userId = req.params.user_id
  userIsOrgAdmin(adminId, orgId)
  .then(bool => {
    if (bool) {
       // are they deleting themselves
      // if yes delete and redirect to /orgs/:userid page
      // if no, check if user is in org
    // get user object with getUserById
      deleteUserFromOrg(orgNAme, userId)
    }
  })
  // return error if user is not admin
});

module.exports = router;
