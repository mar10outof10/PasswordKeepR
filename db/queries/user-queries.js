const db = require('../db');

function getUserById(userId) {
  return db.query(`
    SELECT *
    FROM users
    WHERE id = $1;
  `, [userId])
  .then(res => res.rows[0]);
}

function getUserByEmail(email) {
  return db.query(`
    SELECT *
    FROM users
    WHERE email = $1;
  `, [email])
  .then(res => res.rows[0]);
}

function addUser(email, password) {
  return db.query(`
    INSERT INTO users (email, password)
    VALUES ($1, $2)
    RETURNING *;
  `, [email, password])
  .then(res => res.rows[0]);
}

function deleteUser(userId) {
  return db.query(`
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
  `, [userId])
  .then(res => res.rowCount === 1);
}

module.exports = { getUserById, getUserByEmail, addUser, deleteUser };
