const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../../db/db.js")


router.get('/', async function(req, res) {
    const url = req.baseUrl.split("/")
  const challengeId = url[url.length-2]


  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
        res.status(401).send({ resetToken:1, error:1, message: 'Invalid or expired token' })
        return 0;
    }


    const user = await db("users").select("*").where("username", decoded.username)
      if (user.length<0) {
        res.status(500).send("unknown error")
        return 0;
      }
      

      const previousRatings = await db("ratings").where("user", decoded.username).where("challenge", challengeId)

      if (previousRatings.length>0) {
        res.status(200).json({
          score:previousRatings[0].score
        })
      } else {
        res.status(200).json({
          score:0
        })
      }
    

    

  });

})

router.post('/', async function(req, res) {
  const url = req.baseUrl.split("/")
  const challengeId = url[url.length-2]


  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
        res.status(401).send({ resetToken:1, error:1, message: 'Invalid or expired token' })
        return 0;
    }


    const user = await db("users").select("*").where("username", decoded.username)
      if (user.length<0) {
        res.status(500).send("unknown error")
        return 0;
      }
      

      const previousRatings = await db("ratings").where("user", decoded.username).where("challenge", challengeId)

      if (previousRatings.length>0) {
        await db("ratings").update("score", req.body.score).where("user", decoded.username).where("challenge", challengeId)
      } else {
        await db("ratings").insert({
          user:decoded.username,
          challenge:challengeId,
          score:req.body.score
        })
      }
    
    console.log(`${decoded.username} rated challenge ${challengeId} to ${req.body.score}`)


    res.status(200).send("good")

  });
  
});

module.exports = router;