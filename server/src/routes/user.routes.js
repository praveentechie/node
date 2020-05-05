import express          from 'express';
import UserController   from "../controller/user.controller";

const router = express.Router()

router.use((req, res, next) => {
  if (!req.session.userContext) {
    res.status(401).send({err: 'User not authorized'});
  } else {
    next();
  }
});

router.post('/', async (req, res) => {
  try {
    let response = await UserController.createUser(req.body);
    res.send({res: response});
  } catch(err) {
    res.send({err})
  }
});

router.get('/:userId', async(req, res) => {
  try {
    let response = await UserController.getUserById(req.params.userId)
    res.send(response);
  } catch(err) {
    res.send({err});
  }
});

router.get('/', async(req, res) => {
  try {
    let response = await UserController.getAllUsers();
    res.send(response);
  } catch(err) {
    res.send({err});
  }
});

export default router;