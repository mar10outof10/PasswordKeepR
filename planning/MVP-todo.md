## Create Routes
- make route files with express.Router() as per routes doc
- ensure render routes get required variables from DB query functions, pass as templateVars

## Create EJS templates for GET endpoints (use figma wireframes as reference)
- determine which variables are required in templateVars

## DB Setup
- Setup .env file
- Create schema files for our tables
- Create example data seeds to insert into tables some users, orgs, passwords, etc.
- Ensure resetdb script is working

## DB query functions (to be called by route handlers)
1) getUserByEmail(email) -> return user {id, email, password}
2) addUser(email, password) -> return new user row {id, email, password}
3) deleteUser(user_id) -> return true/false 
4) getAllPasswords(user_id) -> return [passwords]
   - all user passwords + passwords for any orgs they're in
5) addPassword(user_id, label, username, password, category, org_id) -> return new password row
6) deletePassword(password_id) -> return true/false (success/failure)
7) addOrg(org_name) -> return new org row
8) deleteOrg(org_name) -> return true/false (success/failure)
9) addUserToOrg(org_name, user_id, is_admin) -> return new org_user row
10) updateUserInOrg(org_name, user_id, is_admin) -> returns updated org_user row
11) deleteUserFromOrg(org_name, user_id) -> returns true/false (success/failure)
12) isOrgAdmin(user_id, org_name) -> returns true if user is org admin



