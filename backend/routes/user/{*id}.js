const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../../db/db.js");

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

    const userStats = await db.raw("select username, currentScore, guessCount, contributionCount from users LEFT JOIN (select user, count(*) as guessCount from guesses group by user) as guessCount ON guessCount.user = users.username LEFT JOIN (select contributor, count(*) as contributionCount from challenges group by contributor) as contributionCount ON contributionCount.contributor = users.username")


    for (let i = 0; i < userStats.length; i++) {
        const userStat = userStats[i];

        if (userStat.username==username) {
            res.status(200).json(userStat)

            return;
        }
        
        
    }
    res.status(403).json({
        error: true,
        message: "user not found"
    })
    
    





});

module.exports = router;