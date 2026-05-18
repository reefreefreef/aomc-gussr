const express = require('express');
const router = express.Router();

const db = require("../db/db.js")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/', async function(req, res) {
  const creds = req.body;

  if (!creds?.username || !creds?.password) {
    return res.status(400).send(JSON.stringify({
      error: true,
      message: 'username and password required'
    }));
  }

  const users = await db('users').select('*').where('username', creds.username);

  function jwtLogin(username) {
    const payload = { username: username };
    const secret = process.env.JWT_SECRET;

    return jwt.sign(payload, secret, {
      expiresIn: '24h'
    });
  }

  if (users.length > 0) {
    const user = users[0];
    const storedPassword = user.password || '';
    let passwordValid = false;

    if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')) {
      passwordValid = await bcrypt.compare(creds.password, storedPassword);
    } else {
      passwordValid = storedPassword === creds.password;
      if (passwordValid) {
        const upgradedHash = await bcrypt.hash(creds.password, 12);
        await db('users').where('username', creds.username).update({ password: upgradedHash });
      }
    }

    if (passwordValid) {
      console.log(`${creds.username} logged in`)
      res.status(200).send(JSON.stringify({
        token: jwtLogin(creds.username),
        username: creds.username
      }));
    } else {
      res.status(401).send(JSON.stringify({
        error: true,
        message: 'wrong credentials'
      }));
    }
  } else {
    
    const hashedPassword = await bcrypt.hash(creds.password, 12);

    await db('users').insert({ ...creds, password: hashedPassword });

    console.log(`created account ${creds.username}`)

    res.status(200).send(JSON.stringify({
      token: jwtLogin(creds.username),
      newAccount: true,
      username: creds.username
    }));
  }
});

module.exports = router;
