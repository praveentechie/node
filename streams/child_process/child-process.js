const express = require('express');
const { spawn } = require('child_process');

const router = express.Router();

router.get('/spawn', (req, res) => {
  const ls = spawn('ls');
  ls.stdout.on('data', data => {
    data = data.toString();
    res.json({data});
  });
});

module.exports = router;
