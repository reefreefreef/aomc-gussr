const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../db/db.js");

router.get('/', async function (req, res) {
    const user = req.body.user

    const username = req.query.user 
    if (req.query.user==undefined) {
        res.send({
            error: true,
            message: "user not defined"
        })
        return;
    }

    const userStats = await db.raw("select username, currentScore, guessCount, contributionCount from users LEFT JOIN (select user, count(*) as guessCount from guesses group by user) as guessCount ON guessCount.user = users.username LEFT JOIN (select contributor, count(*) as contributionCount from challenges group by contributor) as contributionCount ON contributionCount.contributor = users.username")
    

    
        res.send({
            error: true,
            message: "challenge not found"
        })
    }





});

module.exports = router;