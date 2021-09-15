const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/list', (req, res) => {
  const dirPath = '/mnt/c/Users/arunachalamp/Videos';
  const dirContents = fs.readdirSync(dirPath);
  console.log(dirContents);

  res.status(200).send(JSON.stringify({files: dirContents.filter(file => file.endsWith('.mp4'))}));
});

router.get('/stream/:fileName', (req, res) => {
  console.log(req.path.fileName);
  const filePath = `/mnt/c/Users/arunachalamp/Videos/${req.params.fileName}`;
  const stat = fs.statSync(filePath);
  console.log(stat);

  const head = {
    'Content-Length': stat.size,
    'Content-Type': 'video/mp4',
  }
  res.writeHead(200, head)
  fs.createReadStream(filePath).pipe(res)
});

module.exports = router;