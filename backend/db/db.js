const knex = require('knex');
const path = require('path');
const dbFile = path.join(__dirname, 'db.sqlite3');


module.exports = knex({
  client: 'sqlite3',
  connection: {
    filename: dbFile,
  },
  useNullAsDefault: true,
});