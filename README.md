# New Tech Learning
This is the final project for CS340 at Oregon State by Nora Marji and Ed Wied.


## Database Setup
* `npm i` to install NPM dependencies
* add a `.env` file with the following:
```
DATABASE_HOST={db host name}
DATABASE_USER={db user name}
DATABASE_PASSWORD={db user password}
DATABASE_NAME={db name}
JWOT_SIGNING={signing password}
```

I've moved the `.env` file to the `src` directory.

I've set up a test db to use called, `Jan20DB`.  We should probably rename it to something else - though if it's running at OSU will be one of our user names. There's a backup you can import - `Jan20DB_Backup.sql` that's in the `sql` folder.

In this case, I'm using,

```
# Database
DATABASE_HOST=localhost
DATABASE_USER=RuntimeTerror
DATABASE_PASSWORD=whatPassword?
DATABASE_NAME=Jan20DB
DATABASE_PORT=3306

# Authentication
JWOT_SIGNING=goTeamRuntimeTerror!!!
```
* note, in case this is later used as portfolio piece, should change JWOT_SIGNING so it's not part of GitHub history

1. Create database
```
mysqladmin create Jan20DB
```

2. Load import
```
 mysql Jan20DB < Jan20DB_Backup.sql
```

3. If you don't already have a user account, create user account,
```
CREATE USER 'RuntimeTerror'@'localhost' IDENTIFIED BY 'whatPassword?';
```

4. Give user account permission on db,
```
GRANT ALL PRIVILEGES ON *.* TO 'RuntimeTerror'@'localhost';
```

5. Need to run `FLUSH PRIVILEGES;`

You should then be able to run db locally with full rights to do whatever.  You can verify user is added with `SELECT user FROM mysql.user;`


## Postman Setup
* I've attached a json file that you can import into Postman with sample queries, `CS 340 Project- New Tech Learning.postman_collection.json`
* I'm using a url parameter named `{{url}}`.  In the upper right, you can set local parameters, or you can change `{{url}}` to `http://localhost:3000`


## Run Modes
### Local
* Build and Run: `npm run start`
* Build and Run in Debug (nodemon): `npm run dev`

### Production
* Build and Run with Forever: `npm run prod`
* Stop Forever Production Run: `npm run stopProd`


## Notes


## Reference Articles
All You Ever Wanted to Know About Sessions In Node.js
https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions

Securing Node.js: Managing Sessions in Express.js
https://lockmedown.com/securing-node-js-managing-sessions-express-js/

mozilla/node-client-sessions
https://github.com/mozilla/node-client-sessions

Best Practices for Secure Session Management in Node
https://blog.jscrambler.com/best-practices-for-secure-session-management-in-node/
