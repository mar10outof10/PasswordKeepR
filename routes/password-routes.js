const express = require('express');
const router  = express.Router();

const { getAllPasswords, getPasswordById, addPassword, editPassword, deletePassword} = require('../db/queries/password-queries')
const { isUserLoggedIn } = require('./helpers')

// Show user password dashboard

router.get('/', (req, res) => {
  if (isUserLoggedIn(req)) {
    const userIdCookie = req.session.user_id;
    getAllPasswords(userIdCookie)
    .then(passwords => {
      return res.send(passwords);
      // const templateVars = { passwords }
      // return res.render('passwords', templateVars);
    })
    .catch(err => {
      return res.redirect('/login', { errorMsg: "error retreiving user passwords" });
    })
  } else {
    return res.redirect('/login', { errorMsg: 'You must be logged in to view passwords' });
  }
});

// Show new password form

router.get('/new', (req, res) => {
  if (isUserLoggedIn(req)) {
    return res.send('password form')
    // const templateVars = { user: userIdCookie }
    // return res.render('password/new', templateVars);
  } else {
    res.redirect('/login', { errorMsg: 'You must be logged in to add a new password' });
  }
});

// Show individual password

router.get('/:id', (req, res) => {
  const passwordId = req.params.id;
  if (isUserLoggedIn(req)) {
    getPasswordById(passwordId)
    .then(password => {
      return res.send(password)
      // const templateVars = { password , user: userIdCookie }
      // return res.render('/password/:id', templateVars)
    })
    .catch(err => {
      res.redirect('/login', { errorMsg: 'This password doesn\'t exist' });
    })
  } else {
    res.redirect('/login', { errorMsg: 'You must be logged in to view this password' });
  }
});


// Add password

router.post('/', (req, res) => {
  if (isUserLoggedIn(req)) {
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
  } else {
    res.end;
  }
})


// Edit individual password

router.post('/:id', (req, res) => {
    if (isUserLoggedIn(req)) {
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
  } else {
    res.end;
  }
});

// Delete password

router.post('/:id/delete', (req, res) => {
  if (isUserLoggedIn(req)) {
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
  } else {
    res.end;
  }
});

module.exports = router;
