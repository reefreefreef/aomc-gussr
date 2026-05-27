const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../../db/db.js");


router.get('/', async function (req, res) {
    const url = req.baseUrl.split("/")
    const challenge_id = url[url.length-2]

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];


    const secret = process.env.JWT_SECRET;

    jwt.verify(token, secret, async function (err, decoded) {
        if (err) {
            res.status(401).send({ resetToken: 1, error: 1, message: 'Invalid or expired token' })
            return 0;
        }

        const user = decoded.username
        const challenges = await db("challenges").select("*").where("id", challenge_id)
        if (challenges.length <= 0) return;
        const challenge = challenges[0]

        const isOwner = challenge.contributor == user

        if (!isOwner) {
            res.status(403).send({ error: 1, message: 'not contributor of this challenge, this has been reported to the admin' })
            return 0;
        } else {

            console.log(`${user} deleted challenge ${challenge_id}`)

            await db("challenges").delete("*").where("id", challenge_id)
            await db("guesses").delete("*").where("challengeId", challenge_id)
            await db("ratings").delete("*").where("challenge", challenge_id)
            
            res.status(200).json({message:`Deleted`});

        }



    })

})


module.exports = router;