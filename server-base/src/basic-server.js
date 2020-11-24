import express          from 'express';
import cors             from 'cors';
import helmet           from 'helmet';
import cookieParser     from 'cookie-parser';
import session          from 'express-session';
import MongoStore       from 'connect-mongo';
import passport         from 'passport';
import https            from 'https';
import { v4 as uuidv4 } from 'uuid';
import fs                from 'fs';

import connect          from "./config/database.config";
import userRoutes       from './routes/user.routes';
import authRoutes       from "./routes/auth.routes";
import { handleError, ExpressException }  from './utils/error-handler';
import { calculateSessionExpiration } from "./utils/cookie-utils";

const app = express();
const NODE_PORT = 4040;
const SESSION_SECRET = 'a_secret_session_key7four';
let mongoStore = MongoStore(session);

(async function init() {
  let mongoose = await connect();

  const key = fs.readFileSync('./key.pem');
  const cert = fs.readFileSync('./cert.pem');
  const server = https.createServer({key, cert}, app);
  app.use(session({
    name: 'auth',
    // This is the secret used to sign the session ID cookie
    secret: SESSION_SECRET,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
      touchAfter: 24 * 3600, // time period in seconds
      collection: 'sessions', // collection to save sessions
      secret: SESSION_SECRET // encrypt contents of session cookie
    }),
    cookie: {
      // Specifies the number (in milliseconds) to use when calculating the Expires Set-Cookie attribute
      maxAge: 60 * 1000,
      // When truthy, the HttpOnly attribute is set, otherwise it is not
      httpOnly: true,
      secure: false
    },
    // ### node: session - forces the session to be saved back to the session store; default true
    resave: false,
    // force the session identifier cookie to be set on every response. The expiration is reset to the original maxAge.
    rolling: true,
    // Forces a session that is "uninitialized" to be saved to the store; default true
    saveUninitialized: false,
    // Function to call to generate a new session ID
    genid(req) {
      return uuidv4();
    }
  }));

  // cross site access
  const whiteList = ['http://localhost:3030', 'http://localhost:3000'];
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

  // app.use(function (req, res, next) {

  //   // Website you wish to allow to connect
  //   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3030');
  //   // Request methods you wish to allow
  //   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  //   // Request headers you wish to allow
  //   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  //   // Set to true if you need the website to include cookies in the requests sent
  //   // to the API (e.g. in case you use sessions)
  //   res.setHeader('Access-Control-Allow-Credentials', true);
  //   // Pass to next layer of middleware
  //   next();
  // });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    // intercept the request
    console.log(req.method + ' request received for ' + req.originalUrl + ' @',new Date());
    console.log('session details', req.session);
    next();
  });
  // TODO: find a better way to get expiration time in client side
  app.use((req, res, next) => {
    let cookie = req.cookies.expirationTime;
    if (cookie && req.session) {
      res.cookie('expirationTime', calculateSessionExpiration());
    }
    next();
  });

  app.use((req, res, next) => {
    // called once request is sent to client
    req.on('end', () => {
      console.log('request ended ', req.session.cookie._expires)
    });
    next();
  });

  app.get('/health-check', (req, res) => {
    res.send('Service is up and running!!!');
  });
  // use `userRoutes` for all requests starting with `/user`
  app.use('/v1/users', userRoutes);
  app.use('/v1/auth', authRoutes);
  app.use('*', (req, res, next) => {
    next(new ExpressException(404, 'Not found', 'Requested path doesn\'t exist'));
  });
  /**
   * ### express: error handling
   */
  app.use((error, req, res, next) => {
    console.error('error logged: ', error);
    handleError(error, res);
  });

  server.listen(NODE_PORT, (err) => {
    if (err) {
      console.error('failed to start server ', err);
    }
    console.log(`Server running in ${NODE_PORT}`);
  });

  process.on('uncaughtException', function(err) {
    // when some unexpected error happens
    console.log('init connection again***************', err);
  });
});