const express = require('express');
const router  = express.Router();

const { getAllPasswords, getPasswordById, addPassword, editPassword, deletePassword} = require('../db/queries/password-queries')
const { isUserLoggedIn } = require('./helpers')

// Show user password dashboard

router.get('/', (res, req) => {
  console.log("getting all passwords...");
  if (isUserLoggedIn(req)) {
    const userIdCookie = req.session.user_id;
    getAllPasswords(userIdCookie)
    .then(passwords => {
      return res.send(passwords);
      // const templateVars = { passwords }
      // return res.render('passwords', templateVars);
    })
    .catch(err => {
      // return res.redirect('/login', { errorMsg: "error retreiving user passwords" });
      console.log(err);
    })
  }
  return res.redirect('/login', { errorMsg: 'You must be logged in to view passwords' });
});

// Show individual password

router.get('/:id', (res, req) => {
  const passwordId = req.params.id;
  if (isUserLoggedIn(req)) {
    getPasswordById(passwordId)
    .then(password => {
      const templateVars = { password , user: userIdCookie }
      return res.render('/password/:id', templateVars)
    })
    .catch(err => {
      console.log(err);
    })
  }
  res.redirect('/login');
});

// Show new password form

router.get('/new', (res, req) => {
  if (isUserLoggedIn(req)) {
    const templateVars = { user: userIdCookie }
    return res.render('password/new', templateVars);
  }
  res.redirect('/login');
});

// Add password

router.post('/', (req, res) => {
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

router.post('/:id', (req, res) => {
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

router.post('/:id/delete', (req, res) => {
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
        res.redirect('/passwords');
      })
    }
  })
});

module.exports = router;
