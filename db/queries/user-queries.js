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

module.exports = { getUserById, getUserByEmail };
