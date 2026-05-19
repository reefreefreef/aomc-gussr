const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const db = require("../db/db.js");


// Adds headers: Access-Control-Allow-Origin: https://guessr.warmsandybeaches.net
router.get('/', async function (req, res) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    const secret = process.env.JWT_SECRET;

    const type = req.query.type


    jwt.verify(token, secret, async function (err, decoded) {
        if (err) {
            res.status(401).send({ error: 1, message: 'Invalid or expired token' })
            return 0;

        }
        console.log(type)
        if (type=="full") {
            const user = await db("users").select("*").where("username", decoded.username)
            if (user.length < 0) {
                res.status(500).send("unknown error")
                return 0;
            }
            const adminUser = user[0].admin
    
            if (!adminUser) {
                res.status(401).send({ error: 1, message: 'not authorised user, this has been reported to the admin' })
                return 0
            }
            const previousGuesses = await db.from("challenges").select("*")
                    res.json(previousGuesses)

        } else if (type=="contributed") {

            const previousGuesses = await db.from("challenges").where("contributor", decoded.username)
                    res.json(previousGuesses)

        } else if (type=="guessed") {
            const previousGuesses = await db.from("challenges").innerJoin("guesses", "guesses.challengeId", "challenges.id").select("id", "title").where("guesses.user", decoded.username)
            res.json(previousGuesses)

        }





    });




});

module.exports = router;