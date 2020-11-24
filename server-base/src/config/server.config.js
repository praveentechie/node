import express          from 'express';
import cors             from 'cors';
import helmet           from 'helmet';
import cookieParser     from 'cookie-parser';
import https            from 'https';
import fs               from 'fs';
import path             from 'path';

import { handleError, ExpressException }  from '../utils/error-handler';
import connect          from "./database.config";

const app = express();

async function init() {
  const key = fs.readFileSync(path.join(__dirname, '../../../../', './commons/key.pem'));
  const cert = fs.readFileSync(path.join(__dirname, '../../../../', './commons/cert.pem'));
  const server = https.createServer({key, cert}, app);
  await connect();
  // cross site access
  const whiteList = ['http://localhost:3000', 'http://localhost:3030', 'http://localhost:4200'];
  app.use(cors({
    origin: (origin, callback) => {
      console.log(whiteList.indexOf(origin) !== -1, ' origin ', origin);
      let isWhiteListed = whiteList.indexOf(origin) !== -1;
      if (process.env.NODE_ENV === 'development' && !origin) {
        isWhiteListed = true;
      }
      if (isWhiteListed) {
        callback(null, true);
      } else {
        callback(new ExpressException(401, 'Unauthorized', 'CORS not allowed'), false);
      }
    },
    credentials: true
  }));
  // protect from vulnerabilities
  app.use(helmet());
  // initialize cookie-parser to allow us access the cookies stored in the browser.
  app.use(cookieParser());

  app.use(express.urlencoded({limit: '50mb', extended: true}))
  // use to make req.body available from express 4.x onwards
  app.use(express.json({limit: '50mb'}));

  app.use((req, res, next) => {
    // intercept the request
    console.log(new Date() + ": method " + req.method + ', request URL: ' + req.originalUrl);
    console.log('session details', req.session);
    next();
  });

  app.get('/ping', (req, res) => {
    res.send({
      uptime: process.uptime(),
      message: 'OK!!!',
      timestamp: Date.now()
    });
  });
  /**
   * ### express: error handling
   */
  app.use((error, req, res, next) => {
    console.error('error logged: ', error);
    handleError(error, res);
  });

  process.on('uncaughtException', function(err) {
    // when some unexpected error happens
    console.log('init connection again***************', err);
  });
  return {server, app};
}

export const initServer = init;