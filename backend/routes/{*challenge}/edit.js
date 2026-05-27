const express = require('express');
const path = require('path');
const router = express.Router();
const jwt = require('jsonwebtoken');

const db = require("../../db/db.js");


router.post('/', async function(req, res) {

  const submissionParams = req.body


  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];


  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
      res.status(401).send({ resetToken: 1, error: 1, message: 'Invalid or expired token' })
      return 0;
    }

    const user = decoded.username
    const challenges = await db("challenges").select("*").where("id", submissionParams.id)
    if (challenges.length <= 0) return;
    const challenge = challenges[0]

    const userData = (await db("users").select("*").where("username", user))
    
    const isOwner = challenge.contributor==user

    if (!isOwner) {
      res.status(403).send({ error: 1, message: 'not contributor of this challenge, this has been reported to the admin' })
      return 0;
    } else {

      
      
      if (submissionParams.title == "") {
        res.status(400).json({
          error: true,
          message: "empty title"
        }); return;
      }
      const otherChallengesWithTitle = await db("challenges").select("*").where("title", submissionParams.title).where("id", "!=", submissionParams.id)

      if (otherChallengesWithTitle.length>0) {
        res.status(400).json({
          error: true,
          message: "submission with that title already exists"
        }); return;
      }


      if (submissionParams.x==undefined || submissionParams.y == undefined || parseFloat(submissionParams.x) == NaN || parseFloat(submissionParams.y) == NaN) {
        res.status(400).json({
          error: true,
          message: "invalid answer coordinates"
        }); return;
      }



      const newChallenge = {
        answer:JSON.stringify({
          x:parseFloat(submissionParams.x),
          y:parseFloat(submissionParams.y)
        }),
        title:submissionParams.title,
      }

      console.log(`${user} modified ${newChallenge.title}`)

      await db("challenges").where("id", submissionParams.id)
        .update("answer", newChallenge.answer)
        .update("title", newChallenge.title)

      res.status(200).json({message:`Submissions successfully edited!`});
    }




  })



});


module.exports = router;