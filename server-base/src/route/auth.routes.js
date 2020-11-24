import express                from 'express';
import got                    from 'got';
import { config as envConfig} from 'dotenv';

import passport                         from 'passport';
import { Strategy as LocalStrategy }    from 'passport-local';
import { Strategy as FBStrategy }       from 'passport-facebook';
import { Strategy as GoogleStrategy }   from 'passport-google-oauth2';
import { Strategy as TwitterStrategy }  from 'passport-twitter';

import UserController                   from "../controller/user.controller";
import { ExpressException }             from '../utils/error-handler';
import { exceptionHandler }             from '../middleware/common.middleware';
import { calculateSessionExpiration }   from '../utils/cookie-utils';

import {
  FACEBOOK_SCOPE , GOOGLE_SCOPE,
  FACEBOOK_PROFILE_FIELDS
} from '../config/passport.config';

const router = express.Router()
envConfig();

passport.serializeUser(function(user, done) {
  console.log('userrrrrr', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
// passport local strategy config and handler
passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
  }, async (username, password, done) => {
    let response = await UserController.validateLogin({userName: username, password});
    if (response) {
      console.log('response', response);
      return done(null, response);
    } else {
      return done(true, false, { message: 'Incorrect username/password.' });
    }
  }
));
// manual login response handler
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {}, (error, userInfo, info) => {
    if (error) {
      next(new ExpressException(401, 'Unauthorized', 'Invalid username or password'));
    } else {
      req.logIn(userInfo, (error) => {
        if (error) {
          next(new ExpressException(500, 'Error', 'Internal server error'));
        }
        res.cookie('expirationTime', calculateSessionExpiration(req.session.cookie.maxAge));
        let {userName, firstName, lastName} = req.user;
        res.send({userContext: {userName, firstName, lastName}});  
      });  
    }
  })(req, res, next);
});
// passport Facebook strategy config and handler
passport.use(new FBStrategy(
  {
    clientID: process.env.ROUGE_APP_ID,
    clientSecret: process.env.ROUGE_APP_SECRET,
    callbackURL: 'http://localhost:4040/v1/auth/facebook/callback',
    profileFields: FACEBOOK_PROFILE_FIELDS,
    enableProof: true
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('user', profile, accessToken, refreshToken);
    let userDetails = await UserController.getUserByUserName(profile._json.name);
    let provider = 'facebook';
    if (!userDetails) {
      let user = {
        profileId: profile._json.id,
        userName: profile._json.name,
        firstName: profile._json.name,
        password: profile._json.name,
        provider
        //profilePic: profile._json.picture
      };
      userDetails = await UserController.createUser(user);  
    }
    done(null, {...userDetails, accessToken, provider, userName: profile._json.name});
  }
));
// authenticate with facebook
router.get('/facebook', passport.authenticate('facebook', { scope: FACEBOOK_SCOPE }));
// authentication response callback handler for facebook
router.get('/facebook/callback',  (req, res, next) => {
  passport.authenticate('facebook', {}, (error, userInfo, info) => {
    console.log('*******', error, userInfo, info);
    if (error) {
      next(new ExpressException(401, 'Unauthorized', 'Invalid username or password'));
    } else {
      let provider = encodeURIComponent(userInfo.provider),
        userName = encodeURIComponent(userInfo.userName),
        token = encodeURIComponent(userInfo.accessToken);
      res.writeHead(301,
        {
          Location: `http://localhost:3030/#/login?provider=${provider}&userName=${userName}&token=${token}`, 'X-Token': 'random'
        }
      );
      res.end();  
    }
  })(req, res, next);
});
// passport Google strategy config and handler
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_APP_ID,
    clientSecret: process.env.GOOGLE_APP_SECRET,
    callbackURL: 'http://localhost:4040/v1/auth/google/callback',
    enableProof: true
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('user', profile, accessToken, refreshToken);
    let userName = `${profile._json.given_name}_${profile._json.family_name}`;
    let userDetails = await UserController.getUserByUserName(userName);
    let provider = 'google';
    if (!userDetails) {
      let user = {
        profileId: profile._json.id,
        userName,
        firstName: profile._json.given_name,
        lastName: profile._json.family_name,
        password: profile._json.name,
        provider
        //profilePic: profile._json.picture
      };
      userDetails = await UserController.createUser(user);  
    }
    done(null, {...userDetails, accessToken, provider, userName});
  }
));
// authenticate with google
router.get('/google', passport.authenticate('google', { scope: GOOGLE_SCOPE }));
// authentication response callback handler for google
router.get('/google/callback',  (req, res, next) => {
  passport.authenticate('google', {}, (error, userInfo, info) => {
    console.log('*******', error, userInfo, info);
    if (error) {
      next(new ExpressException(401, 'Unauthorized', 'Invalid username or password'));
    } else {
      let provider = encodeURIComponent(userInfo.provider),
        userName = encodeURIComponent(userInfo.userName),
        token = encodeURIComponent(userInfo.accessToken);
      res.writeHead(301,
        {
          Location: `http://localhost:3030/#/login?provider=${provider}&userName=${userName}&token=${token}`, 'X-Token': 'random'
        }
      );
      res.end();  
    }
  })(req, res, next);
});
// passport Twitter strategy config and handler
passport.use(new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_API_KEY,
    consumerSecret: process.env.TWITTER_API_SERCRET_KEY,
    callbackURL: 'http://localhost:4040/v1/auth/twitter/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    console.log('user', profile, accessToken, refreshToken);
    let userDetails = await UserController.getUserByUserName(profile._json.name);
    let provider = 'twitter';
    if (!userDetails) {
      let user = {
        profileId: profile._json.id,
        userName: profile._json.name,
        firstName: profile._json.name,
        password: profile._json.name,
        provider
        //profilePic: profile._json.picture
      };
      userDetails = await UserController.createUser(user);  
    }
    done(null, {...userDetails, accessToken, provider, userName: profile._json.name});
  }
));
// authenticate with twitter
router.get('/twitter', passport.authenticate('twitter'));
// authentication response callback handler for twitter
router.get('/twitter/callback',  (req, res, next) => {
  passport.authenticate('twitter', {}, (error, userInfo, info) => {
    console.log('*******', error, userInfo, info);
    if (error) {
      next(new ExpressException(401, 'Unauthorized', 'Invalid username or password'));
    } else {
      let provider = encodeURIComponent(userInfo.provider),
        userName = encodeURIComponent(userInfo.userName),
        token = encodeURIComponent(userInfo.accessToken);
      res.writeHead(301,
        {
          Location: `http://localhost:3030/#/login?provider=${provider}&userName=${userName}&token=${token}`, 'X-Token': 'random'
        }
      );
      res.end();  
    }
  })(req, res, next);
});
// tweak to redirect to app home page
router.post('/social-login/validate', async (req, res, next) => {
  const providerMap = {
    facebook: `https://graph.facebook.com/me?access_token=${decodeURIComponent(req.body.token)}`,
    google: `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${decodeURIComponent(req.body.token)}`
  };
  try {
    await got(providerMap[decodeURIComponent(req.body.provider)]);
    let userInfo = await UserController.getUserByUserName(decodeURIComponent(req.body.userName));
    req.logIn(userInfo, (error) => {
      if (error) {
        console.log('error', error);
        next(new ExpressException(500, 'Error', 'Internal server error'));
      } else {
        let {userName, firstName, lastName} = req.user;
        res.send({userContext: {userName, firstName, lastName}});  
      }
    });
  } catch(err) {
    console.log('err', err);
    next(new ExpressException(401, 'Unauthorized', 'Token expired. Please login again'));
  }
});

// manual login process
/* router.post('/login', (req, res, next) => {
  try {
    let response = await UserController.validateLogin(req.body);
    if (response === false) {
      res.status(401);
    } else {
      // changing structure to be in compact with client when using passport
      req.session.passport = {
        user: {
          userName: req.body.userName
        }
      };
      res.cookie('expirationTime', calculateSessionExpiration(req.session.cookie.maxAge));
      res.cookie('userName', req.body.userName);
      await req.session.save();
    }
    res.send({userContext: req.session.userContext});
  } catch(err) {
    console.log(err);
    res.send({err})
  }
});*/

const logoutFn = async (req, res) => {
  res.clearCookie('expirationTime');
  res.clearCookie('userName');
  req.logOut();
  // enable below for manual logout
  // await req.session.destroy();
  res.status(204).send();
};
router.post('/logout', exceptionHandler(logoutFn));

export default router;