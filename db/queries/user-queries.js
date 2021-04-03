const db = require('../db');

function getUserById(userId) {
  return db.query(`
    SELECT *
    FROM users
    WHERE id = $1;
  `, [userId])
  .then(res => res.rows[0]);
}

module.exports = { getUserById };
