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
  const filePath = `/mnt/c/Users/arunachalamp/Videos/${req.params.fileName}`;
  // get file stats
  const stats = fs.statSync(filePath);

  let range = req.headers['range'];
  if (!range) {
    // 416 wrong range
    res.sendStatus(416);
  }

  // read start and end values from header `range` Eg: format `bytes=0-1000/4000`
  let [start, end] = range.replace('bytes=', '').split('-');
  start = parseInt(start, 10);
  end = end ? parseInt(end, 10) : stats.size - 1;
  // chunk size for each response
  let chunksize = end - start + 1;

  const head = {
    'Content-Range': `bytes ${start}-${end}/${stats.size}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': 'video/mp4',
  };
  // 206 - partial content response type
  res.writeHead(206, head);
  // add start and end options to stream.
  fs.createReadStream(filePath, {start, end}).pipe(res);
});

module.exports = router;