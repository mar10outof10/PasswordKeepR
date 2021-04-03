const express = require('express');
const router  = express.Router();

const {} = require

// /login

router.get('/login', (res, req) => {
  res.render('/login')
});

// /register

router.get('/register', (res, req) => {
  res.render('/register')
});

// /passwords

router.get('/passwords', (res, req) => {
  const userId = cookies.userId
  getAllPasswords(userId)
  res.render('passwords', templateVars)
});

// /passwords/:id

router.get('/passwords/:id', (res, req) => {
  res.render('individual password', templateVars)
});

// /passwords/new

router.get('/passwords/new', (res, req) => {
  res.render('new password page', templateVars)
});

// /orgs

router.get('/orgs', (res, req) => {
  res.render('/orgs', templateVars)
});

// /orgs/:id

router.get('/orgs/:id', (res, req) => {
  res.render('/orgs/:id', templateVars)
});
