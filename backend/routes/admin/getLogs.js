const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../../db/db.js")

const { exec } = require('child_process');



router.get('/', async function(req, res) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  
  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
        res.status(401).send({ resetToken:1, error:1, message: 'Invalid or expired token' })
        return 0;
    }

    const user = await db("users").select("*").where("username", decoded.username)
    if (user.length<0) {
      res.status(500).send("unknown error")
      return 0;
    }
    const adminUser = user[0].admin

    if (!adminUser) {
      res.status(401).send({ error:1, message: 'not authorised user, this has been reported to the admin' })
      return 0
    }
    

    exec('journalctl -u aomc-guessr -n 40 --output=cat', (error, stdout, stderr) => {
  if (error) {
    console.error(`Execution error: ${error.message}`);
    res.status(500).json({
        error:true,
        message:error.message
    })
    return;
  }
  if (stderr) {
    console.error(`Shell error: ${stderr}`);
    res.status(500).json({
        error:true,
        message:stderr
    })
    return;
  }
  res.status(200).json({
    logs:stdout,
  })
});


    
    


    

  });
  
});

module.exports = router;