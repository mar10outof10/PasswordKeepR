const db = require('../db');

function addOrg(orgName) {
  return db.query(`
    INSERT INTO orgs (name)
    VALUES ($1)
    RETURNING *;
  `, [orgName])
  .then(res => res.rows[0]);
}

module.exports = { addOrg };
