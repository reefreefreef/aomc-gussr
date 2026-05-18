const express = require('express');
const path = require('path');
const router = express.Router();

const db = require("../../db/db.js")


router.get('/', async function (req, res) {
    const url = req.baseUrl.split("/")
    const current_challenge = url[url.length-1]
    

    const challenge = (await db("challenges").where("id", current_challenge).select("*"))[0]
    

    res.sendFile(challenge.imagePath, { root: path.join(__dirname, "../../") }); //placeholder

});

module.exports = router;