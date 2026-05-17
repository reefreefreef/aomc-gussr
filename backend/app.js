const express = require('express');
const fs = require('fs');
const path = require('path');
const knex = require('knex');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/img', express.static('images'));



const dbFile = path.join(__dirname, 'db', 'db.sqlite3');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbFile,
  },
  useNullAsDefault: true,
});


const reverseProxy = "/api"

app.get(reverseProxy + '/current', async function (req, res) {

  res.sendFile('today.png', { root: path.join(__dirname, 'images') }); //placeholder

});

app.post(reverseProxy + '/login', async function (req, res) {

  const creds = req.body

  const users = await db("users").select("*").where("username", creds.username)

  function jwtLogin(username) {
    const payload = { username: username };
    const secret = process.env.JWT_SECRET;

    return jwt.sign(payload, secret, {
      expiresIn: '24h'
    });
  }

  if (users.length > 0) {

    user = users[0]
    if (user.username == creds.username && user.password == creds.password) {


      res.status(200).send(JSON.stringify({
        token: jwtLogin(creds.username),
        username:creds.username
      }))
    } else {
      res.status(401).send(JSON.stringify({
        error: true,
        message: "wrong credentials"
      }))
    }

  } else {
    console.log("Creating new user ", creds.username)


    await db("users").insert(creds)

    res.status(200).send(JSON.stringify({
      token: jwtLogin(creds.username),
      newAccount: true,
      username:creds.username
    }))
  }


});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});