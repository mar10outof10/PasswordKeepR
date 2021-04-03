const db = require('../db');


/**
 * Grab the user object for the given user id.
 *
 * @param {Number} userId        Id of the user.
 * @return {object}              The user object representing the user with that id, or undefined.
 */
const getUserById = function(userId) {
  return db.query(`
    SELECT *
    FROM users
    WHERE id = $1;
  `, [userId])
    .then(res => res.rows[0]);
};

/**
 * Grab the user object for the given email.
 *
 * @param {String} email         Email of the user.
 * @return {object}              The user object representing the user with that id, or undefined.
 */
const getUserByEmail = function(email) {
  return db.query(`
    SELECT *
    FROM users
    WHERE email = $1;
  `, [email])
    .then(res => res.rows[0]);
};

/**
 * Add a user to the users table.
 *
 * @param {String} email         Email of the user.
 * @param {String} password      Hashed password of the user.
 * @return {object}              The user object representing the new user.
 */
const addUser = function(email, password) {
  return db.query(`
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING *;
  `, [email, password])
    .then(res => res.rows[0]);
};

/**
 * Deletes a user from the users table.
 *
 * @param {String} userId        Id of the user to be deleted.
 * @return {boolean}             True if deletion was successful, else false.
 */
const deleteUser = function(userId) {
  return db.query(`
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
  `, [userId])
    .then(res => res.rowCount === 1);
};

module.exports = { getUserById, getUserByEmail, addUser, deleteUser };
