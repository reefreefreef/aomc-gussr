const express = require('express');
const router = express.Router();

const { updateScores } = require('../../scores');

router.post('/', async function(req, res) {

    updateScores()
  
    res.status(200).send("good")
    
    
});

module.exports = router;