# New Tech Learning
This is the final project for CS340 at Oregon State by Nora Marji and Ed Wied.

## Setup
* `npm i` to install NPM dependencies
* add a `.env` file with the following:
```
DATABASE_HOST={db host name}
DATABASE_USER={db user name}
DATABASE_PASSWORD={db user password}
DATABASE_NAME={db name}
JWOT_SIGNING={signing password}
```

## Run Modes
### Local
* Build and Run: `npm run start`
* Build and Run in Debug (nodemon): `npm run dev`

### Production
* Build and Run with Forever: `npm run prod`
* Stop Forever Production Run: `npm run stopProd`
