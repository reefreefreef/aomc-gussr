const express = require('express');
const path = require('path');
const router = express.Router();

const db = require("../db/db.js")


router.get('/', async function(req, res) {

  const current_challenge = parseInt((await db("app_flags").where("key", "current_challenge").select("*"))[0].value)
  
  const challenge = (await db("challenges").where("id", current_challenge).select("*"))[0]

  res.sendFile(challenge.imagePath.replace("images", process.env.IMAGES)); //placeholder
  
});

module.exports = router;