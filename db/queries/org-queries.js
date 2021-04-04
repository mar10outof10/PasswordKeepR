const db = require('../db');

/**
 * Adds an organization to the orgs table.
 *
 * @param {String} orgName       The name of the organization.
 * @return {Promise<object>}     A promise that resolves with the new organization object.
 */
const addOrg = function(orgName) {
  return db.query(`
    INSERT INTO orgs (name)
    VALUES ($1)
    RETURNING *;
  `, [orgName])
    .then(res => res.rows[0]);
};

/**
 * Edits an organization in the orgs table.
 *
 * @param {Number} orgId         The id of the organization.
 * @param {String} newOrgName    The new name of the organization.
 * @return {Promise<object>}     A promise that resolves with the updated organization object.
 */
const editOrg = function(orgId, newOrgName) {
  return db.query(`
    UPDATE orgs
    SET name = $1
    WHERE id = $2
    RETURNING *;
  `, [newOrgName, orgId])
    .then(res => res.rows[0]);
};

/**
 * Deletes an organization from the orgs table.
 *
 * @param {Number} orgId         The id of the organization.
 * @return {Promise<boolean>}     A promise that resolves to true if the deletion was successful.
 */
const deleteOrg = function(orgId) {
  return db.query(`
    DELETE FROM orgs
    WHERE id = $1;
  `, [orgId])
    .then(res => res.rowCount === 1);
};

/**
 * Adds a user to an organization.
 *
 * @param {Number} userId         The id of the user to add.
 * @param {Number} orgId          The id of the organization.
 * @param {boolean} isAdmin       If the user should be an org admin.
 * @return {Promise<object>}      A promise that resolves to the new org_user object.
 */
const addUserToOrg = function(userId, orgId, isAdmin) {
  return db.query(`
    INSERT INTO org_users (user_id, org_id, is_admin)
    VALUES ($1, $2, $3)
    RETURNING *;
  `, [userId, orgId, isAdmin])
    .then(res => res.rows[0]);
};

/**
 * Updates a users status in an organization.
 *
 * @param {Number} userId         The id of the user to update.
 * @param {Number} orgId          The id of the organization.
 * @param {boolean} isAdmin       If the user should be an org admin.
 * @return {Promise<object>}      A promise that resolves to the updated org_user object.
 */
const updateUserInOrg = function(userId, orgId, isAdmin) {
  return db.query(`
    UPDATE org_users
    SET is_admin = $1
    WHERE user_id = $2 AND org_id = $3
    RETURNING *;
  `, [isAdmin, userId, orgId])
    .then(res => res.rows[0]);
};

/**
 * Deletes a user from an organization.
 *
 * @param {Number} userId         The id of the user to remove.
 * @param {Number} orgId          The id of the organization.
 * @return {Promise<boolean>}     A promise that resolves to true if the user was removed successfully.
 */
const deleteUserFromOrg = function(userId, orgId) {
  return db.query(`
    DELETE FROM org_users
    WHERE user_id = $1
    AND org_id = $2
    RETURNING *;
  `, [userId, orgId])
    .then(res => res.rowCount === 1);
};

/**
 * Checks if the user is an admin of the given org.
 *
 * @param {Number} userId         The id of the user to check.
 * @param {Number} orgId          The id of the organization.
 * @return {Promise<boolean>}     A promise that resolves to true if the user is an admin of the org.
 */
const userIsOrgAdmin = function(userId, orgId) {
  return db.query(`
    SELECT *
    FROM org_users
    WHERE user_id = $1
    AND org_id = $2;
  `, [userId, orgId])
    .then(res => {
      if (res.rows[0] === undefined) {
        return false;
      }
      return res.rows[0].is_admin;
    });
};

/**
 * Checks if the user is a member of an org.
 *
 * @param {Number} userId         The id of the user to check.
 * @param {Number} orgId          The id of the organization.
 * @return {Promise<boolean>}     A promise that resolves to true if the user is a member of an org.
 */
const userIsInOrg = function(userId, orgId) {
  return db.query(`
    SELECT *
    FROM org_users
    WHERE user_id = $1
    AND org_id = $2;
  `, [userId, orgId])
    .then(res => res.rows[0] ? true : false);
};


module.exports = { addOrg, editOrg, deleteOrg, addUserToOrg, updateUserInOrg, deleteUserFromOrg, userIsOrgAdmin, userIsInOrg };
