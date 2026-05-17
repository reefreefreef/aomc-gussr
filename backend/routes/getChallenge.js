const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../db/db.js");

async function determinePersonalGuess(username, challenge_info) {

    const ownGuess = await db("guesses").select("*").where("user", username)
    const answer = JSON.parse(challenge_info.answer)

    if (ownGuess.length>0) {
        const ownGuessCoords = JSON.parse(ownGuess[0].guess)

        console.log(answer, ownGuessCoords)

        const distance = Math.sqrt((answer.x-ownGuessCoords.x)**2+(answer.y-ownGuessCoords.y)**2)

        return {
            own:ownGuessCoords,
            answer:answer,
            dst:distance
        }


    } else {
        return null
    }
    
}


router.post('/', async function(req, res) {
  const challenge_id = req.body.challenge

  var challenge_info = await db("challenges").select("*").where("id", challenge_id)

  if (challenge_info.length>0) {
    challenge_info = challenge_info[0]

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    
    const secret = process.env.JWT_SECRET;

    

    if (challenge_info.revealed) {
        const additionalGuesses = await db("guesses").select("*").where("challengeId", challenge_id)

        jwt.verify(token, secret, async function (err, decoded) {
            if (err) {
                res.send({
                    ...challenge_info,
                    guesses:additionalGuesses,
                })
                return 1
            }

            
            console.log("authed", decoded.username)
            
            res.send({
                ...challenge_info,
                guesses:additionalGuesses,
                personalGuess:await determinePersonalGuess(decoded.username, challenge_info)
            })
        });


        
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