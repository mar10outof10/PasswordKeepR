const db = require('../db');

function addOrg(orgName) {
  return db.query(`
    INSERT INTO orgs (name)
    VALUES ($1)
    RETURNING *;
  `, [orgName])
  .then(res => res.rows[0]);
}

function editOrg(orgId, newOrgName) {
  return db.query(`
    UPDATE orgs
    SET name = $1
    WHERE id = $2
    RETURNING *;
  `, [newOrgName, orgId])
  .then(res => res.rows[0]);
}

function deleteOrg(orgId) {
  return db.query(`
    DELETE FROM orgs
    WHERE id = $1;
  `, [orgId])
  .then(res => res.rowCount === 1);
}

function addUserToOrg(userId, orgId, isAdmin) {
  return db.query(`
    INSERT INTO org_users (user_id, org_id, is_admin)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [userId, orgId, isAdmin])
  .then(res => res.rows[0]);
}

function updateUserInOrg(userId, orgId, isAdmin) {
  return db.query(`
    UPDATE org_users
    SET is_admin = $1
    WHERE user_id = $2 AND org_id = $3
    RETURNING *;
  `, [isAdmin, userId, orgId])
  .then(res => res.rows[0]);
}

function deleteUserFromOrg(userId, orgId) {
  return db.query(`
    DELETE FROM org_users
    WHERE user_id = $1
    AND org_id = $2
    RETURNING *;
  `, [userId, orgId])
  .then(res => res.rowCount === 1);
}

function isOrgAdmin(userId, orgId) {
  return db.query(`
    SELECT *
    FROM org_users
    WHERE user_id = $1
    AND org_id = $2;
  `, [userId, orgId])
  .then(res => {
    if (res.rows[0] === undefined) {
      return false
    }
    return res.rows[0].is_admin;
  })
}

module.exports = { addOrg, editOrg, deleteOrg, addUserToOrg, updateUserInOrg, deleteUserFromOrg, isOrgAdmin };
