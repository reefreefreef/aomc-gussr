const express = require('express');
const router = express.Router();


const db = require("../db/db.js");



router.get('/', async function(req, res) {
  var challenge_info = await db("challenges").select("id", "title").where("revealed", 1)

  res.send(challenge_info)
    

    

  
});

module.exports = router;