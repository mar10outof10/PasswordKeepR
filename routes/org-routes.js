const express = require('express');
const router  = express.Router();

const { getUserById } = require('../db/queries/user-queries');
const { getAllOrgs, getOrgById, addUserToOrg, addOrg, userIsOrgAdmin, editOrg, deleteOrg, deleteUserFromOrg, usersInOrg, numberUsersInOrg, userOrgJoinDate } = require('../db/queries/org-queries');
const { isAuthenticated, isNotAuthenticated } = require('./helpers')

/* Show orgs dashboard
* logged in user  -> go to /orgs
* else            -> go to /login
*/
router.get('/', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;
  getAllOrgs(userId)
  .then(orgs => {
    const orgData = [];
    for (org of orgs) {
      const orgObj = {};
      orgObj.name = org.name;
      numberUsersInOrg(org.id)
      .then(length => {

        orgObj.memberCount = length;
        userOrgJoinDate(userId, org.id)
        .then(joinDate => {
          orgObj.joinDate = joinDate;
        })
        .catch(err => res.json(err));

      })
      .catch(err => res.json(err));
      orgData.push(orgObj);
    }
    return orgData
  })
  .then(orgsArray => {
    const templateVars = { userId: req.session.user_id, orgsArray }
    return res.render('orgs_index', templateVars);
  });
});

/* New organisation form
* logged in user  -> go to /orgs/new
* else            -> go to /login
*/
router.get('/new', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;
  return res.render('orgs_new', { userId });
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
    return res.redirect(`/orgs/${orgUser.id}`);
  })
  .catch(() => res.status(401).send());
});

/* Show individual org
* logged in user  -> go to /orgs/:id
* else            -> go to /login
*/
router.get('/:id', isAuthenticated, (req, res) => {
  const orgId = req.params.id;
  const templateVars = { userId: req.session.userId }

  getOrgById(orgId)
  .then(org => {

    usersInOrg(org.id)
    .then(users => {
      templateVars.members = users; // set of rows from org_users where org_id = org.id
    })
    .catch(err => res.json(err));

  })
  .then(org => {a
    templateVars.org = org;
    return res.render('orgs_show', templateVars);
  })
  .catch(err => res.json(err));
});

/* Edit individual org
* logged in user  -> edit org in Db
* else            -> go to /login
*/
router.post('/:id', isAuthenticated, (req, res) => {
  const orgId = req.params.id;
  const userId = req.session.user_id;
  userIsOrgAdmin(userId, orgId)
  .then(isAdmin => {
    if (isAdmin) {
      const orgName = req.body.org_name;
      return editOrg(orgId, orgName);
    }
    return Promise.reject();
  })
  .then(() => {
    return res.redirect(`/orgs/${orgId}`);
  })
  .catch(() => res.status(401).send());
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
      return res.send('org deleted');
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
  .then(orgUser => res.json(orgUser));
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
      return res.redirect('/orgs');
    } else {
      return res.status(500).send('Error deleting user from org');
    }
  })
  .catch(err => res.json(err));
});

module.exports = router;
