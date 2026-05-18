const knex = require('knex');
const path = require('path');
const dbFile = process.env.DB


module.exports = knex({
  client: 'sqlite3',
  connection: {
    filename: dbFile,
  },
  useNullAsDefault: true,
});