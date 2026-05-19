const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../db/db.js");
const { evaluateScore } = require("../scores")

async function determinePersonalGuess(username, challenge_info) {

    const ownGuess = await db("guesses").select("*").where("user", username).where("challengeId", challenge_info.id)
    const answer = JSON.parse(challenge_info.answer)

    if (ownGuess.length > 0) {
        const ownGuessCoords = JSON.parse(ownGuess[0].guess)

        

        const distance = Math.sqrt((answer.x - ownGuessCoords.x) ** 2 + (answer.y - ownGuessCoords.y) ** 2)
        const score = evaluateScore(ownGuessCoords, answer)

        return {
            own: ownGuessCoords,
            answer: answer,
            dst: distance,
            score: score
        }


    } else {
        return null
    }

}


router.post('/', async function (req, res) {
    const challenge_id = req.body.challenge

    var challenge_info = await db("challenges").select("*").where("id", challenge_id)

    if (challenge_info.length > 0) {
        challenge_info = challenge_info[0]

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];

        const secret = process.env.JWT_SECRET;




        const additionalGuesses = await db("guesses").select("*").where("challengeId", challenge_id)

        jwt.verify(token, secret, async function (err, decoded) {
            if (err) {
                res.status(401).send({ error:1, message: 'Invalid or expired token' })
                return 0;
            }


            

            const previousGuesses = await db("guesses").select("*").where("user", decoded.username).where("challengeId", challenge_id)

            const contributor = challenge_info.contributor==decoded.username
            

            if (previousGuesses.length > 0 || contributor) {
                res.send({
                    ...challenge_info,
                    guesses: additionalGuesses,
                    personalGuess: await determinePersonalGuess(decoded.username, challenge_info)
                })
            } else {
                res.status(401).json({
                    error: true,
                    message:"you do not have access to this challenge"
                })
            }


        });







    } else {
        res.send({
            error: true,
            message: "challenge not found"
        })
    }





});

module.exports = router;