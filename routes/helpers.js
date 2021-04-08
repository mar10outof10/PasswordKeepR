const { getAllOrgs, userIsOrgAdmin, userIsInOrg } = require('../db/queries/org-queries');
const { getPasswordById } = require('../db/queries/password-queries');


/**
 * Ensures a user is logged in -> redirect to /login otherwise
 */
const isAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return next();
  }
  return res.redirect('/login');
}
/**
 * Ensures a user is not logged in -> redirect to /passwords otherwise
 */
const isNotAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return res.redirect('/passwords');
  }
  return next();
};

/**
 * Verifies a user has permission to save/edit a given password.
 * Proceeds if user owns the password, or password belongs to an org where the user is an admin. Rejects otherwise.
 */
const hasPasswordWriteAccess = (req, res, next) => {
  const passwordId = req.params.id;
  const userId = req.session.user_id;

  getPasswordById(passwordId)
  .then(password => {
    if (!password) {
      // password doesn't exist -> error
      return res.status(500).send();
    }
    if (password.user_id === userId) {
      // user owns password -> proceed
      return next();
    } else if (!password.org_id) {
      // user doesn't own the password and it has no org -> reject
      return res.status(401).send();
    }
    // user doesn't own password but it belongs to an org -> check if user is admin
    userIsOrgAdmin(userId, password.org_id)
    .then(isOrgAdmin => {
      if (isOrgAdmin) {
        // user is org admin -> proceed
        next();
      } else {
        // user doens't own password and is not org admin -> proceed
        return res.status(401).send();
      }
    });
  });
};

/**
 * Verifies a user has permission to view a given org.
 * Proceeds if user is org member/admin. Rejects otherwise.
 */
const hasOrgReadAccess = (req, res, next) => {
  const orgId = req.params.id;
  const userId = req.session.user_id;

  userIsInOrg(userId, orgId)
  .then(isMember => {
    if (isMember) return next();
    return res.status(401).send();
  });
};

/**
 * Verifies a user has permission to save/edit on a given org.
 * Proceeds if user is org admin, or org is blank. Rejects otherwise.
 */
const hasOrgWriteAccess = (req, res, next) => {
  const { orgId } = req.body;
  const userId = req.session.user_id;

  if (orgId !== '') {
    // org was given -> check if user is admin
    userIsOrgAdmin(userId, orgId)
    .then(admin => {
      // user is admin -> proceed
      if (admin) return next();
      // user is not admin -> reject
      else return res.status(401).send();
    });
  } else {
    // org is blank -> proceed
    next();
  }
};


module.exports = { isAuthenticated, isNotAuthenticated, hasPasswordWriteAccess, hasOrgReadAccess, hasOrgWriteAccess };

// const hasPasswordReadAccess = (req, res, next) => {
//   const passwordId = req.params.id;
//   const userId = req.session.user_id;

//   const getPasswordPromise = getPasswordById(passwordId);
//   const getOrgsPromise = getAllOrgs(userId);

//   Promise.all([getPasswordPromise, getOrgsPromise])
//   .then(values => {
//     const password = values[0];
//     const orgs = values[1];

//     if (password.user_id === userId) {
//       // user owns the password -> all good
//       return next();
//     }

//     for (const org of orgs) {
//       if (org.id === password.org_id) {
//         // password is in an org user belongs to -> all good
//         return next();
//       }
//     }

//     // user doesn't have access
//     return res.status(401).send();
//   });
// };
