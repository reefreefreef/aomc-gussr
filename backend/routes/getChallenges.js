const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const db = require("../db/db.js");


// Adds headers: Access-Control-Allow-Origin: https://guessr.warmsandybeaches.net
router.get('/', async function (req, res) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    const secret = process.env.JWT_SECRET;


    jwt.verify(token, secret, async function (err, decoded) {
        if (err) {
            res.send("not authed")
            return 1
        }

        
        const previousGuesses = await db.from("challenges").innerJoin("guesses", "guesses.challengeId", "challenges.id").select("id", "title").where("guesses.user", decoded.username)



        res.send(previousGuesses)
    });




});

module.exports = router;