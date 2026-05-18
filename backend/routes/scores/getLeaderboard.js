const express = require('express');
const router = express.Router();

const { getLeaderboard } = require('../../scores');

router.get('/', async function(req, res) {

    const leaderboard = await getLeaderboard()

    res.status(200).send(leaderboard)
    
    
});

module.exports = router;