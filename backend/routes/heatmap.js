const express = require('express');
const path = require('path');
const router = express.Router();

const { getImageFile, checkFile } = require('./images/{*id}.js');

const db = require("../db/db.js")


router.get('/', async function (req, res) {

    const currentDay = new Intl.DateTimeFormat("en-US", {
        timeZone: "Australia/Brisbane",
        weekday: "long",
    }).format(new Date());

    if (currentDay!="Tuesday") {
        
        let coords = await db("challenges").select("answer")
        
        coords = coords.map(e => {
            return JSON.parse(e.answer)
        })
        
        res.status(200).json(coords)
    } else {
        res.status(200).json([])
    }
        


});

module.exports = router;