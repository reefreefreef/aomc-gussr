const express = require('express');
const path = require('path');
const router = express.Router();

const {getImageFile, checkFile} = require('./images/{*id}.js');

const db = require("../db/db.js")


router.get('/', async function (req, res) {

  const current_challenge = parseInt((await db("app_flags").where("key", "current_challenge").select("*"))[0].value)

  res.sendFile(await getImageFile(current_challenge)); //placeholder

});

module.exports = router;