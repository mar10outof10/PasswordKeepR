DROP TABLE IF EXISTS orgs CASCADE;
CREATE TABLE orgs (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(100) NOT NULL,
  UNIQUE (name)
);

DROP TABLE IF EXISTS org_users CASCADE;
CREATE TABLE org_users (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  org_id INT REFERENCES orgs(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_admin BOOLEAN DEFAULT false,
  UNIQUE (user_id, org_id)
);
