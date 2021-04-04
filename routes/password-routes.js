const express = require('express');
const router  = express.Router();

// Show user password dashboard

router.get('/passwords', (res, req) => {
  const userIdCookie = req.session.user_id;
  if (userIdCookie) {
    getAllPasswords(userIdCookie)
    .then(passwords => {
      const templateVars = { passwords }
      return res.render('passwords', templateVars);
    })
  }
  res.redirect('/login');
});

// Show individual password

router.get('/passwords/:id', (res, req) => {
  const userIdCookie = req.session.user_id;
  const passwordId = req.params.id;
  if (userIdCookie) {
    getPasswordById(passwordId)
    .then(password => {
      const templateVars = { password , user: userIdCookie }
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

// Add password

router.post('/passwords', (req, res) => {
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

router.post('/passwords/:id', (req, res) => {
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

router.post('/passwords/:id/delete', (req, res) => {
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
