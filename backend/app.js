const express = require('express');
const fs = require('fs');
const path = require('path');
const knex = require('knex');


const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json())

app.use('/img', express.static('images'));



const dbFile = path.join(__dirname, 'db', 'db.sqlite3');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbFile,
  },
  useNullAsDefault: true,
});



app.get('/current', async function (req, res) {
  
  res.sendFile('today.png', { root: path.join(__dirname, 'images') }); //placeholder

});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});