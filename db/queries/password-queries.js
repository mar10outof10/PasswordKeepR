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

function addPassword(label, username, password, category, user_id, org_id) {

  if (arguments.length < 6) {
    return Promise.reject(`addPassword requires 6 arguments, only received ${arguments.length}`);
  }
  return db.query(`
    INSERT INTO passwords (label, username, password, category, user_id, org_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `, Array.from(arguments))
  .then(res => res.rows[0]);
}

function editPassword(label, username, password, category, user_id, org_id, passwordId) {

  if (arguments.length < 7) {
    return Promise.reject(`editPassword requires 7 arguments, only received ${arguments.length}`);
  }

  return db.query(`
    UPDATE passwords
    SET (label, username, password, category, user_id, org_id) = ($1, $2, $3, $4, $5, $6)
    WHERE id = $7
    RETURNING *;
  `, Array.from(arguments))
  .then(res => res.rows[0]);
}

function deletePassword(passwordId) {
  return db.query(`
    DELETE FROM passwords
    WHERE id = $1;
  `, [passwordId])
  .then(res => res.rowCount === 1);
}

module.exports = { getAllPasswords, addPassword, editPassword, deletePassword };
