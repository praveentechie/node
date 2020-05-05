import express          from 'express';
import UserController   from "../controller/user.controller";

const router = express.Router()

router.post('/login', async (req, res) => {
  try {
    let response = await UserController.validateLogin(req.body);
    if (response === false) {
      res.status(401);
    } else {
      req.session.userContext = {
        userName: req.body.userName
      };
      res.cookie('expirationTime', req.session.cookie.maxAge);
      res.cookie('userName', req.body.userName);
      await req.session.save();
    }
    res.send({userContext: req.session.userContext});
  } catch(err) {
    console.log(err);
    res.send({err})
  }
});

router.post('/logout', async (req, res) => {
  try {
    res.clearCookie('expirationTime');
    res.clearCookie('userName');
    await req.session.destroy();
    res.status(204).send();
  } catch(err) {
    console.log(err);
    res.send({err})
  }
});

export default router;