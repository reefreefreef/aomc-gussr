const express = require('express');
const router = express.Router();

const db = require("../db/db.js")


router.get('/', async function(req, res) {

  const current_challenge = parseInt((await db("app_flags").where("key", "current_challenge").select("*"))[0].value)
  
  res.send(current_challenge)
  
});

module.exports = router;