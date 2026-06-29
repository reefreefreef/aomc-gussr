const express = require('express');
const path = require('path');
const router = express.Router();

const db = require("../../db/db.js")

async function checkFile(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function getImageFile(id) {
  const challenge = (await db("challenges").where("id", id).select("*"))[0]
    const file = path.parse(challenge.imagePath)

    var resFile = file.base

    if (file.ext!=".gif" && checkFile(process.env.IMAGES+"/"+file.name+".webp")) {
        resFile = file.name+".webp"
    } 
    
    return process.env.IMAGES+"/"+resFile
}

router.get('/', async function (req, res) {
    const url = req.baseUrl.split("/")
    const current_challenge = url[url.length-1]
    

    
    res.sendFile(await getImageFile(current_challenge)); //placeholder

});

module.exports = {router:router, getImageFile:getImageFile, checkFile:checkFile};