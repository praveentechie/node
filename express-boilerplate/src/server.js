'use strict';

const express = require('express');

// Constants
const PORT = 8484;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, HOST);
console.log(process.env.NODE_ENV);
console.log(`Node server running on http://${HOST}:${PORT}`);
