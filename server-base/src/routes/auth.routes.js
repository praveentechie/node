import express                from 'express';
import passport               from 'passport';
import { Strategy as LocalStrategy }  from 'passport-local';

import UserController         from "../controller/user.controller";
import { calculateSessionExpiration } from '../utils/cookie-utils';
import { ExpressException } from '../utils/error-handler';
import { exceptionHandler } from '../utils/middlewares';

const router = express.Router()

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

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
});
*/

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