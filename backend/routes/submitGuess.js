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

    const guessRow = {
        user: decoded.username,
        challengeId: req.body.challenge,
        guess: JSON.stringify(req.body.guess),
    }

    const previousGuesses = await db("guesses").select("*").where("user", guessRow.user).where("challengeId", guessRow.challengeId)
    if (previousGuesses.length>0) {
        await db("guesses").where("user", guessRow.user).where("challengeId", guessRow.challengeId).update("guess", guessRow.guess)
    } else {
        await db("guesses").insert(guessRow)
    }


    console.log(guessRow)
    

    res.status(200).send("good")

  });
  
});

module.exports = router;