const { getAllOrgs, userIsOrgAdmin } = require('../db/queries/org-queries');
const { getPasswordById } = require('../db/queries/password-queries');

const isAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    // console.log('middleware passed')
    return next();
  }
  // return res.redirect('/login', { errorMsg: 'You must be logged in to view passwords' });
  return res.redirect('/login');
}

const isNotAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return res.redirect('/passwords');
  }
  // console.log('middleware passed')
  return next();
};

const hasPasswordReadAccess = (req, res, next) => {
  const passwordId = req.params.id;
  const userId = req.session.user_id;

  const getPasswordPromise = getPasswordById(passwordId);
  const getOrgsPromise = getAllOrgs(userId);

  Promise.all([getPasswordPromise, getOrgsPromise])
  .then(values => {
    const password = values[0];
    const orgs = values[1];

    if (password.user_id === userId) {
      // user owns the password -> all good
      return next();
    }

    for (const org of orgs) {
      if (org.id === password.org_id) {
        // password is in an org user belongs to -> all good
        return next();
      }
    }

    // user doesn't have access
    return res.status(401).send();
  });
};

const hasPasswordWriteAccess = (req, res, next) => {
  const passwordId = req.params.id;
  const userId = req.session.user_id;

  getPasswordById(passwordId)
  .then(password => {
    if (password.user_id === userId) {
      // user owns password
      return next();
    } else if (!password.org_id) {
      // if user doesn't own the password and it has no org -> reject
      return res.status(401).send();
    }
    // user doesn't own password but it belongs to an org -> check if user is admin
    userIsOrgAdmin(userId, password.org_id)
    .then(isOrgAdmin => {
      if (isOrgAdmin) {
        next();
      } else {
        // user doens't own password and is not org admin -> no write access
        return res.status(401).send();
      }
    });
  });
};

/**
 * Verify a user is an org admin (if org is provided), then call some function.
 *
 * @param {String[]} adminCheckArgs   An array containing the userId and orgId to provide to userIsOrgAdmin check.
 * @param {Function} func             A function to run if the admin check is successful.
 * @param {Object[]} funcArgs         Argumements to pass to the function above.
 * @return {any}                      The result of the passed in function.
 */
 const verifyOrgAdminThenDo = (adminCheckArgs, func, funcArgs) => {
  let promiseChain = Promise.resolve();
  if (adminCheckArgs[1] !== '') promiseChain = promiseChain.then(() => userIsOrgAdmin(... adminCheckArgs));
                       promiseChain = promiseChain.then(admin => {
                       if (admin !== false) { return func(... funcArgs); }
                         else { return Promise.reject(); }
                       });
                       return promiseChain;
};


module.exports = { isAuthenticated, isNotAuthenticated, hasPasswordReadAccess, hasPasswordWriteAccess, verifyOrgAdminThenDo };
