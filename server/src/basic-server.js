const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dbConnection = require('./db/db-connection');
const userRoutes = require('./routes/user-routes');

const app = express();

const PORT = 4040;

// use to make req.body available from express 4.x onwards
app.use(express.json())
// cross site access
app.use(cors());
// protect from vulnerabilities
app.use(helmet());
// use `userRoutes` for all requests starting with `/user`
app.use('/users', userRoutes);

function initAppConnections() {
  app.listen(PORT, (err) => {
    if (err) {
      console.log('failed to start server ', err);
    }
    console.log(`Server running in ${PORT}`);
    dbConnection.connection(function(err) {
      if (err) {
        console.log('DB connection failed');
      }
    });
  });  
}

initAppConnections();

process.on('uncaughtException', function(err) {
  //do something here
  console.log('init connection again***************8');
  // initAppConnections();
});