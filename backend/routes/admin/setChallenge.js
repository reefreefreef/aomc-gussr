const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../../db/db.js")


router.post('/', async function(req, res) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  
  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
        res.status(401).send({ error:1, message: 'Invalid or expired token' })
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
    
    

    await db("app_flags").where("key", "current_challenge").update("value", req.body.challenge)


    res.status(200).send("set")

  });
  
});

module.exports = router;