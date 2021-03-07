# New Tech Learning
This is the final project for CS340 at Oregon State by Nora Marji and Ed Wied.

## Environment config Setup
* `npm i` to install NPM dependencies
* add a `.env` file with the following:
```
DATABASE_HOST={db host name}
DATABASE_USER={db user name}
DATABASE_PASSWORD={db user password}
DATABASE_NAME={db name}
JWOT_SIGNING={signing password}
```

The `.env` file should be in the `src` directory, with a set up like,

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

## Database Setup

1. Create database
```
mysqladmin create cs340_wiede
```

2. Load import
```
 mysql cs340_wiede < cs340_wiede.sql
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


## Run Modes
### Local
* Build and Run: `npm run start`
* Build and Run in Debug (nodemon): `npm run dev`

### Production
* Build and Run with Forever: `npm run prod`
* Stop Forever Production Run: `npm run stopProd`
