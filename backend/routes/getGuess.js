const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../db/db.js")


// Adds headers: Access-Control-Allow-Origin: https://guessr.warmsandybeaches.net
router.post('/', async function(req, res) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];

  
  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
      res.status(401).send({ error:1, message: 'Invalid or expired token' })
      return 0;
    }
    const current_challenge = parseInt((await db("app_flags").where("key", "current_challenge").select("*"))[0].value)
    
    const guesses = await db("guesses").select("*").where("user", decoded.username).where("challengeId", current_challenge)
    if (guesses.length>0) {
        res.status(200).send({
            previousGuess:JSON.parse(guesses[0].guess)
        })
    } else {
        res.status(200).send({
            previousGuess:null
        })
    }
    

    

  });
  
});

module.exports = router;