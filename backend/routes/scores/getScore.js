const express = require('express');
const router = express.Router();

const { getScore } = require('../../scores');

router.get('/', async function(req, res) {

    
    if (req.query.user)  {
        const score = await getScore(req.query.user)

        res.status(200).send(score)
    } else {
        res.status(400).send("no user")
    }
    
    
    
});

module.exports = router;