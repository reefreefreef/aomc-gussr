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
      res.status(401).send("nah")
    }

    
    

    await db("app_flags").where("key", "current_challenge").update("value", req.body.challenge)


    res.status(200).send("set")

  });
  
});

module.exports = router;