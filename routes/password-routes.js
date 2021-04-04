const express = require('express');
const router  = express.Router();

const { getAllPasswords, getPasswordById, addPassword, editPassword, deletePassword} = require('../db/queries/password-queries')
const { isAuthenticated } = require('./helpers')

// Show user password dashboard

router.get('/', isAuthenticated, (req, res) => {
  getAllPasswords(userIdCookie)
  .then(passwords => {
    return res.send(passwords);
      // const templateVars = { passwords }
      // return res.render('passwords', templateVars);
  })
  .catch(err => {
    return res.redirect('/login', { errorMsg: "error retreiving user passwords" });
  })
  return res.redirect('/login', { errorMsg: 'You must be logged in to view passwords' });
})

// Show new password form

router.get('/new', isAuthenticated, (req, res) => {
    return res.send('password form')
    // const templateVars = { user: userIdCookie }
    // return res.render('password/new', templateVars);
});

// Show individual password

router.get('/:id', isAuthenticated,  (req, res) => {
  const passwordId = req.params.id;
  getPasswordById(passwordId)
  .then(password => {
    return res.send(password)
  // const templateVars = { password , user: userIdCookie }
  // return res.render('/password/:id', templateVars)
  })
  .catch(err => {
    res.redirect('/login', { errorMsg: 'This password doesn\'t exist' });
  })
});


// Add password

router.post('/', isAuthenticated, (req, res) => {
  const { label, username, password, category, orgId } = req.body;
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
  .catch(err => {
    res.json(err);
  })
})


// Edit individual password

router.post('/:id', isAuthenticated, (req, res) => {
  const { label, username, password, category, orgId } = req.body;
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
  .catch(err => {
    res.json(err);
  })
});

// Delete password

router.post('/:id/delete', isAuthenticated, (req, res) => {
  const passwordId = req.params.id;
  getPasswordById(passwordId)
  .then(passwordObj => {
    userIdCookie = req.params.user_id;
    if (passwordObj.userId === userIdCookie) {
      deletePassword(passwordId)
      .then(rowCount => {
        res.json(rowCount);
        // res.redirect('/passwords');
      })
      .catch(err => {
        res.json(err);
      })
    }
  })
});

module.exports = router;
