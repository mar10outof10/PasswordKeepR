const express = require('express');
const router  = express.Router();

const {} = require

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
    res.redirect('/passwords');
    return;
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
      res.render('passwords', templateVars);
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
      res.render('/password/:id', templateVars)
    })
  }
  res.redirect('/login');
});

// Show new password form

router.get('/passwords/new', (res, req) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    const templateVars = { user: userIdCookie }
    res.render('password/new', templateVars);
  }
  res.redirect('/login');
});

// /orgs

router.get('/orgs', (res, req) => {
  const userIdCookie = req.session.user_id;
  res.render('/orgs', templateVars)
});

// /orgs/:id

router.get('/orgs/:id', (res, req) => {
  const userIdCookie = req.session.user_id;
  res.render('/orgs/:id', templateVars)
});
