const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '../out'),
  filename: (req, file, cb) => {
    console.log('file', file);
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });
const type = upload.single('file');

router.post('/upload', type, (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.status(201).json({});
});

router.post('/upload/stream', (req, res) => {
  console.log('streaming');
  let byteReceived = 0;

  let filePath = path.join(__dirname, '../out', req.headers[`x-file-id`]);
  let fileStream = fs.createWriteStream(filePath, {
    flags: 'a'
  });

  req.on('data', (data) => {
    byteReceived += data.length;
  });

  req.pipe(fileStream);

  fileStream.on('close', () => {
    res.status(200).json({byteReceived});
  });
});

module.exports = router;
