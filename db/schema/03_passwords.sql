DROP TABLE IF EXISTS passwords CASCADE;
CREATE TABLE passwords (
  id SERIAL PRIMARY KEY NOT NULL,
  label VARCHAR(100),
  url VARCHAR(100),
  username VARCHAR(100),
  password VARCHAR(100),
  category VARCHAR(100),
  user_id INT REFERENCES users(id) NOT NULL,
  org_id INT REFERENCES orgs(id) ON DELETE SET NULL
);
