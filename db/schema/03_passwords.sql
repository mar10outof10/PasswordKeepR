DROP TABLE IF EXISTS passwords CASCADE;
CREATE TABLE passwords (
  id SERIAL PRIMARY KEY NOT NULL,
  label VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  user_id INT REFERENCES users(id) NOT NULL,
  org_id INT REFERENCES orgs(id)
);
