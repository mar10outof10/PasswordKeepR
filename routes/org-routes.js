const express = require('express');
const router  = express.Router();

const { getUserById } = require('../db/queries/user-queries');
const { getAllOrgs, getOrgById, getOrgByName, addUserToOrg, addOrg, userIsOrgAdmin, editOrg, deleteOrg, deleteUserFromOrg, usersInOrg, numberUsersInOrg, userOrgJoinDate, updateUserInOrg, getOrgSummaryForUser, userIsInOrg } = require('../db/queries/org-queries');
const { isAuthenticated, isNotAuthenticated } = require('./helpers');
const { reset } = require('nodemon');

/* Show orgs dashboard
* logged in user  -> go to /orgs
* else            -> go to /login
*/
router.get('/', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;

  const getOrgSummaryPromise = getOrgSummaryForUser(userId);
  const getUserPromise = getUserById(userId);
  Promise.all([getOrgSummaryPromise, getUserPromise])
  .then(values => {
    const orgs = values[0];
    const email = values[1].email
    return res.render('orgs_index', { orgs, email });
  });
});

/* New organisation form
* logged in user  -> go to /orgs/new
* else            -> go to /login
*/
router.get('/new', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;
  getUserById(userId)
  .then(user => {
    return res.render('orgs_new', { email: user.email });
  });
});

/* Add new org
* logged in user  -> add new org to Db
* else            -> go to /login
*/
router.post('/', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;
  const orgName = req.body.org_name;
  addOrg(orgName)
  .then(org => {
    console.log('org', org);
    return addUserToOrg(userId, org.id, true);
  })
  .then(orgUser => {
    console.log('redir to', `/orgs/${orgUser.org_id}`)
    return res.redirect(`/orgs/${orgUser.org_id}`);
  })
  .catch(err => console.error(err));
});

/* Show individual org
* logged in user  -> go to /orgs/:id
* else            -> go to /login
*/
router.get('/:id', isAuthenticated, (req, res) => {
  const orgId = req.params.id;
  const userId = req.session.user_id;
  const templateVars = { orgId };
  // checks if query param for error exists
  if (req.query.error) {
    templateVars.error = req.query.error;
  }
  userIsInOrg(userId, orgId)
  .then(isMember => {
    if(!isMember) { return Promise.reject(401); }
  })
  .then(() => getOrgById(orgId))
  .then(org => {
    templateVars.orgName = org.name;
    return usersInOrg(org.id);
  })
  .then(users => {
    templateVars.members = users; // set of rows from org_users where org_id = org.id
    return getUserById(userId);
  })
  .then(user => {
    templateVars.email = user.email;
    return userIsOrgAdmin(userId, orgId)
  })
  .then(isAdmin => {
    templateVars.isAdmin = isAdmin;
    return res.render('orgs_show', templateVars);
  })
  .catch(status => res.status(status).send());
});

/* Edit individual org
* logged in user  -> edit org in Db
* else            -> go to /login
*/
router.post('/:id', isAuthenticated, (req, res) => {
  const orgId = req.params.id;
  const userId = req.session.user_id;
  const newOrgName = req.body.org_name;
  getOrgByName(newOrgName)
    .then((orgExists) => {
      if (orgExists && orgExists.id !== Number(orgId)) {
        return res.redirect(`/orgs/${orgId}?error=orgExists`);
      }
      return userIsOrgAdmin(userId, orgId)
    })
    .then(isAdmin => {
      console.log('isadmin', isAdmin);
      if (isAdmin) {
        return editOrg(orgId, newOrgName);
      }
      return Promise.reject(401);
    })
    .then(() => {
      return res.redirect(`/orgs/${orgId}`);
    })
    .catch(status => res.status(status).send());
});

/* Delete individual org
* logged in user  -> delete org in Db
* else            -> go to /login
*/
router.post('/:id/delete', isAuthenticated, (req, res) => {
  // check if user is admin of org
  const orgId = req.params.id
  const userId = req.session.user_id;
  userIsOrgAdmin(userId, orgId)
  .then(isAdmin => {
    if (isAdmin) {
      return deleteOrg(orgId);
    }
    return Promise.reject(401);
  })
  .then(deletedSuccessfully => {
    if (deletedSuccessfully) {
      return res.redirect('/orgs');
    }
    return Promise.reject(500);
  })
  .catch(status => res.status(status).send());
});


/* Add user to org
* logged in user  -> add user to org in Db
* else            -> go to /login
*/
router.post('/:id/:userid', isAuthenticated, (req, res) => {
  const orgId = req.params.id;
  const makeAdmin = req.body.admin || false;
  const userId = req.session.user_id;
  const userIdToAdd = req.params.userid;

  console.log('userId', userId);
  console.log('orgId', orgId);
  userIsOrgAdmin(userId, orgId)
  .then(isOrgAdmin => {
    if (isOrgAdmin) {
      return addUserToOrg(userIdToAdd, orgId, makeAdmin);
    }
  })
  .then(() => res.redirect(`/orgs/${orgId}`))
  .catch(() => res.status(401).send());
});

// Remove user from org
router.post('/:id/:userid/delete', isAuthenticated, (req, res) => {
  const userId = req.session.user_id
  const userIdToDelete = req.params.userid;
  const orgId = req.params.id;

  userIsOrgAdmin(userId, orgId)
  .then(isAdmin => {
    if (isAdmin) {
      return deleteUserFromOrg(userIdToDelete, orgId);
    } else {
      return res.status(401).send();
    }
  })
  .then(deletedSuccessfully => {
    if (deletedSuccessfully) {
      return res.redirect(`/orgs/${orgId}`);
    } else {
      return res.status(500).send('Error deleting user from org');
    }
  })
  .catch(err => res.json(err));
});

/* Update user status in organization
* Logged in user is admin   -> updates target user's credentials within organisation
*                              Currently only admin status is modifiable
* else                      -> go to /login if not logged in, go to /orgs if logged in
*/
router.post('/:id/:userid/update', isAuthenticated, (req, res) => {
  const userId = req.session.user_id
  const userIdToModify = req.params.userid;
  const orgId = req.params.id;
  const admin = req.body.admin;

  userIsOrgAdmin(userId, orgId)
  .then(isAdmin => {
    if (isAdmin) {
      return updateUserInOrg(userIdToModify, orgId, admin);
    }
    return Promise.reject(401);
  })
  .then(() => res.redirect(`/orgs/${orgId}/`))
  .catch(status => res.status(status).send());
})
module.exports = router;
