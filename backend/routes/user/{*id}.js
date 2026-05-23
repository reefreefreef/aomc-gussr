const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../../db/db.js");

const { evaluateScore } = require("../../scores.js")

async function getUserScores(username) {
  var userScores = []
  const userGuesses = await db.from("guesses").innerJoin("challenges", "guesses.challengeId", "challenges.id").select("id", "guess", "challenges.answer").where("guesses.user", username)

  for (let j = 0; j < userGuesses.length; j++) {
    const userGuess = userGuesses[j];

    userGuess.answer = JSON.parse(userGuess.answer)
    userGuess.answer = {
      x: userGuess.answer.x + Math.sign(userGuess.answer.x) / 2,
      y: userGuess.answer.y + Math.sign(userGuess.answer.y) / 2
    }

     userScores.push(evaluateScore(
      JSON.parse(userGuess.guess),
      userGuess.answer
    ))

  }

  return userScores
}

router.get('/', async function (req, res) {
    const url = req.baseUrl.split("/")
    const username = url[url.length-1]

    console.log(url, username)

    

    if (username==undefined) {
        res.status(400).send({
            error: true,
            message: "user not defined"
        })
        return;
    }

    const userStats = await db.raw(`select * from (select username, users.contributor, currentScore, guessCount, contributionCount, contributionRating, ratingsMade from users LEFT JOIN (select user, count(*) as guessCount from guesses group by user) as guessCount ON guessCount.user = users.username LEFT JOIN (select contributor, count(*) as contributionCount from challenges group by contributor) as contributionCount ON contributionCount.contributor = users.username LEFT JOIN (select contributor, avg(averageRating) as contributionRating from (select * from challenges LEFT JOIN (select challenge as id, avg(score) as averageRating from ratings group by challenge) as averageScores ON averageScores.id=challenges.id) group by contributor) as avgContributionRatings ON avgContributionRatings.contributor=users.username LEFT JOIN (select user, count(*) as ratingsMade from ratings group by user) as ratingsMadeC ON ratingsMadeC.user=users.username) where username="${username}"`)

    for (let i = 0; i < userStats.length; i++) {
        const userStat = userStats[i];

        if (userStat.username==username) {
            res.status(200).json({
                ...userStat,
                scores:await getUserScores(username)
        })

            return;
        }
        
        
    }
    res.status(403).json({
        error: true,
        message: "user not found"
    })
    
    





});

module.exports = router;