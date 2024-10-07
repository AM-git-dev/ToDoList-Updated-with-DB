#Welcome to my TaskManager / TODO LIST

## To run the project you have to install MariaDB, create a database in local, give yourself all privileges to write data in your db.

https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.5.2&os=windows&cpu=x86_64&pkg=msi&mirror=serverion SELECT YOUR OS TO have the good installer

## Replace the connection information at the top of the code line 9 by your mariadb infos

```
const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'myusername',
    password: 'passwordIfDefined',
    database: 'DbName',
```
## Install the dependances

In your terminal : `npm install`

### RUN THE PROJECT

`node "filename.js"`

HF
