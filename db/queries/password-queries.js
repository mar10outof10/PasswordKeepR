const db = require('../db');

/**
 * Gets all passwords belonging to a user, or any organization they're a part of.
 *
 * @param {String} userId        Id of the user.
 * @return {Promise<[object]>}   A promise that resolves to an array containing password objects.
 */
const getAllPasswords = function(userId) {
  return db.query(`
    SELECT  passwords.*,
            orgs.name AS org_name,
            CASE
              WHEN user_id = $1 THEN TRUE
              WHEN org_id IN (SELECT org_id FROM org_users WHERE user_id=$1 AND is_admin=TRUE) THEN TRUE
              ELSE FALSE
            END has_write_access
    FROM passwords
    LEFT OUTER JOIN orgs ON org_id = orgs.id
    WHERE user_id = $1
    OR org_id IN (SELECT org_id FROM org_users WHERE user_id = $1)
    ORDER BY org_name NULLS FIRST, category NULLS FIRST, label;
  `, [userId])
    .then(res => res.rows);
};

/**
 * Gets all passwords belonging to a user, or any organization they're a part, matching a given search query.
 *
 * @param {String} userId        Id of the user.
 * @param {String} searchQuery   Search query to match on the password label or URL.
 * @return {Promise<[object]>}   A promise that resolves to an array containing password objects.
 */
 const getAllPasswordsSearch = function(userId, searchQuery) {

  searchQuery = '%' + searchQuery + '%';

  return db.query(`
    WITH cte AS (
      SELECT passwords.*, orgs.name AS org_name
      FROM passwords
      LEFT OUTER JOIN orgs ON org_id = orgs.id
      WHERE user_id = $1
      OR org_id IN (SELECT org_id FROM org_users WHERE user_id = $1)
      ORDER BY org_name NULLS FIRST, category NULLS FIRST, label)
    SELECT *,
          CASE
            WHEN user_id = 11 THEN TRUE
            WHEN org_id IN (SELECT org_id FROM org_users WHERE user_id=11 AND is_admin=TRUE) THEN TRUE
            ELSE FALSE
          END has_write_access
    FROM cte
    WHERE (label ILIKE $2 OR url ILIKE $2);
  `, [userId, searchQuery])
    .then(res => res.rows);
};

/**
 * Gets the password with the given id.
 *
 * @param {String} passwordId    Id of the password.
 * @return {Promise<object>}   A promise that resolves to a password object.
 */
const getPasswordById = function(passwordId) {
  return db.query(`
    SELECT *
    FROM passwords
    WHERE id = $1;
  `, [passwordId])
  .then(res => res.rows[0]);
};

/**
 * Add a password to the passwords table.
 *
 * @param {object} passwordObj               The password object to save.
 * @param {String} passwordObj.label         The label for the password entry.
 * @param {String} passwordObj.url           The url for the password entry.
 * @param {String} passwordObj.username      The username for the password entry.
 * @param {String} passwordObj.password      The password.
 * @param {String} passwordObj.category      The category for the password entry.
 * @param {Number} passwordObj.userId        The user_id the password belongs to.
 * @param {Number} [passwordObj.orgId]       (Optional) The org_id the password belongs to.
 * @return {Promise<object>}                 A promise that resolves to the password object that was inserted.
 */
const addPassword = function(passwordObj) {

  let { label, url, username, password, category, userId, orgId } = passwordObj;

  if (orgId === '') {
    orgId = null;
  }
  if (category === '') {
    category = null;
  }

  if (Object.keys(passwordObj).length < 6) {
    return Promise.reject(`addPassword: passwordObj requires 7 keys, only received ${Object.keys(passwordObj).length}`);
  }
  return db.query(`
    INSERT INTO passwords (label, url, username, password, category, user_id, org_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `, [label, url, username, password, category, userId, orgId])
    .then(res => res.rows[0]);
};

/**
 * Edits a password in the passwords table.
 *
 * @param {Number} passwordId                The id of the password to update.
 * @param {object} passwordObj               The password object to save.
 * @param {String} passwordObj.label         The label for the password entry.
 * @param {String} passwordObj.url           The url for the password entry.
 * @param {String} passwordObj.username      The username for the password entry.
 * @param {String} passwordObj.password      The password.
 * @param {String} passwordObj.category      The category for the password entry.
 * @param {Number} passwordObj.userId        The user_id the password belongs to.
 * @param {Number} [passwordObj.orgId]       (Optional) The org_id the password belongs to.
 * @return {Promise<object>}                 A promise that resolves to the password object that was inserted.
 */
const editPassword = function(passwordId, passwordObj) {

  let { label, url, username, password, category, userId, orgId } = passwordObj;

  if (orgId === '') {
    orgId = null;
  }

  if (!passwordId) {
    return Promise.reject('editPassword: passwordId is required');
  }
  if (Object.keys(passwordObj).length < 6) {
    return Promise.reject(`editPassword: passwordObj requires 7 keys, only received ${Object.keys(passwordObj).length}`);
  }

  return db.query(`
    UPDATE passwords
    SET (label, url, username, password, category, user_id, org_id) = ($1, $2, $3, $4, $5, $6, $7)
    WHERE id = $8
    RETURNING *;
  `, [label, url, username, password, category, userId, orgId, passwordId])
    .then(res => res.rows[0]);
};

/**
 * Deletes a password from the passwords table.
 *
 * @param {Number} passwordId    The id of the password to delete.
 * @return {Promise<boolean>}    A promise that returns to true if deletion was successful, else false.
 */
const deletePassword = function(passwordId) {
  return db.query(`
    DELETE FROM passwords
    WHERE id = $1;
  `, [passwordId])
    .then(res => res.rowCount === 1);
};

module.exports = { getAllPasswords, getAllPasswordsSearch, getPasswordById, addPassword, editPassword, deletePassword };
