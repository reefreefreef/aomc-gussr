const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../db/db.js")
const { updateScores } = require("../scores")



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

    const guessRow = {
        user: decoded.username,
        challengeId: current_challenge,
        guess: JSON.stringify(req.body.guess),
    }
    
    const previousGuesses = await db("guesses").select("*").where("user", guessRow.user).where("challengeId", guessRow.challengeId)
    if (previousGuesses.length>0) {
        res.send("already submitted")
    } else {
        await db("guesses").insert(guessRow)
    }

    console.log(`${guessRow.user} made guess at ${guessRow.guess}`)
    updateScores()


    
    

    res.status(200).send("good")

  });
  
});

module.exports = router;