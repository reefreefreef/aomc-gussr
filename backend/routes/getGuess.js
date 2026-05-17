const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../db/db.js")


router.post('/', async function(req, res) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token)
  
  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
      throw Error({ message: 'Invalid or expired token' });
    }

    console.log("authed", decoded.username)
    console.log(req.body)

    
    
    

    res.status(200).send("good")

  });
  
});

module.exports = router;