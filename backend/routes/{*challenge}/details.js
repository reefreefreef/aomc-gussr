const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../../db/db.js");
const { evaluateScore } = require("../../scores.js")

async function determinePersonalGuess(username, challenge_info) {

    const ownGuess = await db("guesses").select("*").where("user", username).where("challengeId", challenge_info.id)
    var answer = challenge_info.answer

    if (ownGuess.length > 0) {
        var ownGuessCoords = JSON.parse(ownGuess[0].guess)
        if ((username == "MarcosGarro" || username == "reef") && Math.random()>0.95) {
            let mag = 0.2,
                base = 10
            ownGuessCoords.x += (base+Math.pow(1+Math.random()*mag,10)*(Math.random()>0.5?-1:1))
            ownGuessCoords.y += (base+Math.pow(1+Math.random()*mag,10)*(Math.random()>0.5?-1:1))
        }
        


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


router.get('/', async function (req, res) {
    const url = req.baseUrl.split("/")
    const challenge_id = url[url.length-2]

    var challenge_info = await db("challenges").select("*").where("id", challenge_id)

    if (challenge_info.length > 0) {
        challenge_info = challenge_info[0]

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];

        const secret = process.env.JWT_SECRET;




        jwt.verify(token, secret, async function (err, decoded) {
            if (err) {
                res.status(401).send({ resetToken: 1, error: 1, message: 'Invalid or expired token' })
                return 0;
            }


            const userCheck = await db("users").select("*").where("username", decoded.username)
            if (userCheck.length < 0) {
                userCheck[0]={admin:false}
            }
            const adminUser = userCheck[0].admin


            challenge_info.answer = JSON.parse(challenge_info.answer)
            challenge_info.answer = {
                x:challenge_info.answer.x+Math.sign(challenge_info.answer.x)/2,
                y:challenge_info.answer.y+Math.sign(challenge_info.answer.y)/2
            }


            const previousGuesses = await db("guesses").select("*").where("user", decoded.username).where("challengeId", challenge_id)

            const contributor = challenge_info.contributor == decoded.username

            const personalRatings = await db("ratings").where("user", decoded.username).where("challenge", challenge_id)
            const personalRating = (personalRatings.length>0)?personalRatings[0].score:0

            const averageRatings = await db("ratings").select("challenge").avg({"average":"score"}).groupBy("challenge").where("challenge", challenge_id)
            const averageRating = (averageRatings.length>0)?averageRatings[0].average:0

            const personalGuess = await determinePersonalGuess(decoded.username, challenge_info)

            const additionalGuesses = await db("guesses").select("*").where("challengeId", challenge_id)
            for (let i = 0; i < additionalGuesses.length; i++) {
                const guess = additionalGuesses[i];
                if (guess.user==decoded.username) guess.guess = JSON.stringify(personalGuess.own)
                additionalGuesses[i].score = evaluateScore(JSON.parse(guess.guess), challenge_info.answer)
            }


            if (previousGuesses.length > 0 || contributor || adminUser) {
                res.send({
                    ...challenge_info,
                    guesses: additionalGuesses,
                    personalGuess: personalGuess,

                    personalRating:personalRating,
                    averageRating:averageRating,
                })
            } else {
                res.status(401).json({
                    error: true,
                    message: "you do not have access to this challenge"
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