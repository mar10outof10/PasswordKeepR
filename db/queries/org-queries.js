const db = require('../db');

function addOrg(orgName) {
  return db.query(`
    INSERT INTO orgs (name)
    VALUES ($1)
    RETURNING *;
  `, [orgName])
  .then(res => res.rows[0]);
}

function editOrg(orgId, newOrgName) {
  return db.query(`
    UPDATE orgs
    SET name = $1
    WHERE id = $2
    RETURNING *;
  `, [newOrgName, orgId])
  .then(res => res.rows[0]);
}

module.exports = { addOrg, editOrg };
