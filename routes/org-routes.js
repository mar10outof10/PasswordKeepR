const express = require('express');
const router  = express.Router();

const { getUserById } = require('../db/queries/user-queries');
const { getAllOrgs, getOrgById, addUserToOrg, addOrg, userIsOrgAdmin, editOrg, deleteOrg, deleteUserFromOrg } = require('../db/queries/org-queries');
const { isAuthenticated, isNotAuthenticated } = require('./helpers')

// Show all user organizations
router.get('/', isAuthenticated, (req, res) => {
  getAllOrgs(req.session.user_id)
  .then(orgs => {
    return res.json(orgs);
    // const templateVars = { user: req.session.user_id, orgs }
    // return res.render('orgs', templateVars);
  });
});

// Add new Org
router.post('/', isAuthenticated, (req, res) => {
  const userId = req.session.user_id;
  const orgName = req.body.org_name;
  addOrg(orgName)
  .then(org => {
    console.log('org', org);
    return addUserToOrg(userId, org.id, true);
  })
  .then(orgUser => {
    return res.json(orgUser);
  });
});

// Get individual org by id
router.get('/:id', isAuthenticated, (req, res) => {
  const orgId = req.params.id;
  getOrgById(orgId)
  .then(org => {
    return res.json(org);
    // const templateVars = { user: userIdCookie, org }
    // return res.render('orgs', templateVars);
  });
});

// Edit org
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
  .then(org => {
    return res.json(org);
  })
  .catch(() => res.status(401).send());
});

// Delete Org
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


// Add user to org
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
      // unsure how we are rendering the orgs/:id page
      return res.render('org', { orgId });
    } else {
      return res.status(500).send('Error deleting user from org');
    }
  })
  .catch(err => res.json(err));
});

module.exports = router;
