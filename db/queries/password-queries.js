const db = require('../db');

function getAllPasswords(userId) {
  return db.query(`
    SELECT *
    FROM passwords
    WHERE user_id = $1
    OR org_id IN (SELECT org_id FROM org_users WHERE user_id = $1);
  `, [userId])
  .then(res => res.rows);
}

module.exports = { getAllPasswords };
