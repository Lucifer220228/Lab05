// db.js
const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'samy4121',
  database: 'university_db',
  connectionLimit: 5
});

module.exports = pool;
