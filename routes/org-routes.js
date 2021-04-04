const express = require('express');
const router  = express.Router();

// Show all user organizations

router.get('/orgs', (res, req) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    getUserById(userIdCookie)
    .then(userObject => {
    getAllOrgs(userObject.userId)
    .then(orgs => {
      const templateVars = { user: userIdCookie, orgs }
      return res.render('orgs', templateVars);
    })
    })
  }
  res.redirect('/login');
});

// Show individual org

router.get('/orgs/:id', (res, req) => {
  const userIdCookie = req.session.user_id;
  const orgId = req.params.id;
  if (userIdCookie) {
    getUserById(userIdCookie)
    .then(getOrg)
    .then(org => {
      const templateVars = { user: userIdCookie, org }
      return res.render('orgs', templateVars);
    });
    res.redirect('/login');
  }
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
    const userId = rew.params.userid
    addUserToOrg(userId, orgId, false);
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
