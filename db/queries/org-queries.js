const db = require('../db');

/**
 * Gets all organizations a user is a member of.
 *
 * @param {String} userId          The id of the user.
 * @return {Promise<[object]>}     A promise that resolves to an array of organization objects.
 */
const getAllOrgs = function (userId) {
  return db.query(`
    SELECT orgs.*
    FROM orgs
    JOIN org_users ON org_id = orgs.id
    JOIN users ON user_id = users.id
    WHERE user_id = $1;
  `, [userId])
    .then(res => res.rows);
};

/**
 * Gets the organization for a given orgId.
 *
 * @param {String} userId          The id of the org.
 * @return {Promise<object>}       A promise that resolves to the organization object.
 */
const getOrgById = function(orgId) {
  return db.query(`
    SELECT *
    FROM orgs
    WHERE id = $1;
  `, [orgId])
  .then(res => res.rows[0]);
};

/**
 * Adds an organization to the orgs table.
 *
 * @param {String} orgName       The name of the organization.
 * @return {Promise<object>}     A promise that resolves with the new organization object.
 */
const addOrg = function (orgName) {
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
const editOrg = function (orgId, newOrgName) {
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
const deleteOrg = function (orgId) {
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
const addUserToOrg = function (userId, orgId, isAdmin) {
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
const updateUserInOrg = function (userId, orgId, isAdmin) {
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
const deleteUserFromOrg = function (userId, orgId) {
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
const userIsOrgAdmin = function (userId, orgId) {
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
const userIsInOrg = function (userId, orgId) {
  return db.query(`
    SELECT *
    FROM org_users
    WHERE user_id = $1
    AND org_id = $2;
  `, [userId, orgId])
    .then(res => res.rows[0] ? true : false);
};

/**
 * Gets all users for a specific org.
 *
 * @param {Number} orgId          The id of the organization.
 * @return {Promise<boolean>}     A promise that resolves to true if the user is a member of an org.
 */
const usersInOrg = function (orgId) {
  return db.query(`
    SELECT users.id, email
    FROM users
    JOIN org_users ON user_id = users.id
    WHERE org_id = $1;
  `, [orgId])
    .then(res => res.rows);
};

/**
 * Gets number of users for a specific org.
 *
 * @param {Number} orgId          The id of the organization.
 * @return {Promise<boolean>}     A promise that resolves to true if the user is a member of an org.
 */
 const numberUsersInOrg = function (orgId) {
  return db.query(`
    SELECT *
    FROM org_users
    WHERE org_id = $1;
  `, [orgId])
    .then(res => res.rows.length);
};

/**
 * Gets the user's join_date for a specific org
 *
 * @param {Number} userId         The id of the user to check.
 * @param {Number} orgId          The id of the organization.
 * @return {Promise<boolean>}     A promise that resolves to true if the user is a member of an org.
 */
const userOrgJoinDate = function (userId, orgId) {
  return db.query(`
  SELECT joined_at
  FROM org_users
  WHERE user_id = $1
  AND org_id = $2;
  `, [userId, orgId])
    .then(res => res.rows[0].joined_at);
};

/**
 * Gets the list of organizations a user belongs to along with the member count of the org
 * and date they joined.
 *
 * @param {Number} userId         The id of the user to check.
 * @return {Promise<object>}      A promise that resolves to an object containing the org name, member count, and user join date.
 */
const getOrgSummaryForUser = function(userId) {
  return db.query(`
    WITH cte AS (
      SELECT name, COUNT(*) AS count
      FROM orgs
      JOIN org_users ON org_id = orgs.id
      GROUP BY name
    )
    SELECT orgs.name, org_users.joined_at, count
    FROM orgs
    JOIN org_users ON org_id = orgs.id
    JOIN users ON user_id = users.id
    JOIN cte ON orgs.name = cte.name
    WHERE user_id = $1;
  `, [userId])
  .then(res => res.rows);
}
module.exports = { getAllOrgs, getOrgById, addOrg, editOrg, deleteOrg, addUserToOrg, updateUserInOrg, deleteUserFromOrg, userIsOrgAdmin, userIsInOrg, usersInOrg, numberUsersInOrg, userOrgJoinDate, getOrgSummaryForUser };
