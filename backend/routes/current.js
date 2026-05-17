const express = require('express');
const path = require('path');
const router = express.Router();


router.get('/', async function(req, res) {
  res.sendFile('today.png', { root: path.join(__dirname, "..", 'images') }); //placeholder
  
});

module.exports = router;