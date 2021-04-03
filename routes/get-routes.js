const express = require('express');
const router  = express.Router();

const { getAllPasswords, getPasswordById,  } = require('../db/queries/password-queries')
const { getAllOrgs, getOrg } = require('../db/queries/org-queries')
const { getUserById } = require('../db/queries/user-queries')

// Render login page

router.get('/login', (res, req) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    res.redirect('/passwords');
    return;
  }
  res.render('login');
})

// Render register page

router.get('/register', (res, req) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    return res.redirect('/passwords');
  }
  res.render('register');
});

// Show user password dashboard

router.get('/passwords', (res, req) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    getAllPasswords(userIdCookie)
    .then(passwords => {
      const passwordArray = passwords;
      const templateVars = { passwords: passwordArray }
      return res.render('passwords', templateVars);
    })
  }
  res.redirect('/login');
});

// Show individual password

router.get('/passwords/:id', (res, req) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    getPasswordById()
    .then(password => {
      const passwordObj = password;
      const templateVars = { password: passwordObj, user: userIdCookie }
      return res.render('/password/:id', templateVars)
    })
  }
  res.redirect('/login');
});

// Show new password form

router.get('/passwords/new', (res, req) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    const templateVars = { user: userIdCookie }
    return res.render('password/new', templateVars);
  }
  res.redirect('/login');
});

// Show all user organizations

router.get('/orgs', (res, req) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    getUserById(userIdCookie)
    .then(userObject => {
    getAllOrgs(userObject.userId)
    .then(orgsObject => {
      const orgs = orgsObject;
      const templateVars = { user: userIdCookie, orgs: orgsObject }
      return res.render('orgs', templateVars);
    })
    })
  }
  res.redirect('/login');
});

// Show individual org

router.get('/orgs/:id', (res, req) => {
  const userIdCookie = req.session.user_id;
  const org = req.params.id
  if (userIdCookie) {
    getUserById(userIdCookie)
    .then(org => {
    getOrg(org)
    .then(returnOrg => {
      const orgObject = returnOrg;
      const templateVars = { user: userIdCookie, org: orgObject }
      return res.render('orgs', templateVars);
    })
    })
    res.redirect('/login');
  }
});
