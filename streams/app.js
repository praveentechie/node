const express = require('express');
const path = require('path');
const videoStreamRoute = require('./video-stream/video-stream');

const PORT = 4747;
const app = express();

app.use(express.static(path.join(__dirname, './public')));
app.use('*.html', express.static(path.join(__dirname, './public')));

app.get('/video-stream', (req, res) => res.sendFile(path.join(__dirname, './public/video-stream.html')));

app.use('/v1/video-stream', videoStreamRoute);

app.listen(PORT, () => {
  console.log(`Running stream server in ${PORT}`);
});
