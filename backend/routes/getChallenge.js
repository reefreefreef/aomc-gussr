const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../db/db.js");


router.post('/', async function(req, res) {
  const challenge_id = req.body.challenge

  var challenge_info = await db("challenges").select("*").where("id", challenge_id)

  if (challenge_info.length>0) {
    challenge_info = challenge_info[0]

    if (challenge_info.revealed) {

        const additionalGuesses = await db("guesses").select("*").where("challengeId", challenge_id)

        res.send({
            ...challenge_info,
            guesses:additionalGuesses,
        })
    } else {
        res.send({
            id:challenge_info.id,
            imagePath:challenge_info.imagePath,
        })
    }

    

  } else {
    res.send({
        error: true,
        message: "challenge not found"
    })
  }
    

    

  
});

module.exports = router;