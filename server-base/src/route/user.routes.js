import express              from 'express';
import UserController       from "../controller/user.controller";
import { exceptionHandler } from '../middleware/common.middleware';
import { authValidator }    from '../middleware/auth.middleware';
const router = express.Router()

router.use(authValidator);

const createUser = async (req, res) => {
  let response = await UserController.createUser(req.body);
  res.send({res: response});
};
router.post('/', exceptionHandler(createUser));

const getUserById = async(req, res) => {
  let response = await UserController.getUserById(req.params.userId)
  res.send(response);
}
router.get('/:userId', exceptionHandler(getUserById));

const getAllUsers = async(req, res) => {
  let response = await UserController.getAllUsers();
  console.log('response', response);
  res.send(response);
};
router.get('/', exceptionHandler(getAllUsers));

export default router;